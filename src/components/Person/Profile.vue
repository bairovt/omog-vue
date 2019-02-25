<template>
  <v-container>
    <v-layout row wrap v-if="person._key">
      <v-flex xs12 class="mb-3">
        <h3>Профиль</h3>
        <h2>
          <strong>{{person.surname}} {{person.name}} {{person.midname}}</strong>
        </h2>
        <div v-if="person.maidenName">дев. фамилия: {{person.maidenName}}</div>
      </v-flex>

      <v-flex xs12 sm3 class="text-xs-center">
        <img
          v-if="person.pic"
          width="250px"
          :src="'/upload/' + person._key + '/' + person.pic"
          alt="pic"
          class="mb-2"
        >
        <a v-if="person.editable" @click.stop="$refs.croppaUpload.openCroppaDialog">Сменить фото</a>

        <div class="mb-2">
          <v-btn small round color="success" :to="`/tree/${person._key}`">ДРЕВО</v-btn>
        </div>
        <div v-if="person.rod">Род:
          <v-btn
            small
            round
            :to="`/rod/${person.rod._key}`"
            class="text-capitalize"
          >{{person.rod.name}}</v-btn>
        </div>
        <div class="pt-2 pb-2">
          <span>Добавил(а):</span>
          <v-btn
            v-if="person.addedBy"
            round
            small
            :to="`/tree/${person.addedBy._key}`"
            class="text-capitalize"
          >
            {{person.addedBy.name}}
            {{person.addedBy.surname}}
          </v-btn>
        </div>
        <br>
        <div v-if="person.editable">
          <v-btn flat outline small @click.stop="deletePerson">Удалить</v-btn>
          <!-- todo: скрыть в подменю -->
          <v-btn small color="accent" @click.stop="editDialog=true">Изменить</v-btn>
        </div>
        <div>
          <span v-if="person.user === null">
            <v-btn
              v-if="user.hasRoles(['manager', 'inviter'])"
              small
              @click.stop="inviteDialog=true"
            >
              <!--<v-btn small @click.stop="inviteDialog=true">-->
              Пригласить
            </v-btn>
            <span v-else></span>
          </span>
          <span v-else>
            <strong>Пользователь</strong>
          </span>
        </div>
      </v-flex>

      <v-flex xs12 sm9 class="mb-2">
        <div>
          <span v-if="person.born">{{person.born}}г</span>
          <span v-if="person.died">&nbsp;- {{person.died}}г</span>
        </div>
        <div>{{person.info}}</div>
      </v-flex>
    </v-layout>

    <v-dialog
      v-if="person._key"
      v-model="editDialog"
      max-width="600px"
      :fullscreen="$vuetify.breakpoint.xsOnly"
    >
      <v-card>
        <v-card-text>
          <person-fields :person="person" :info="true"></person-fields>
        </v-card-text>

        <v-card-actions>
          <v-btn @click.stop="updatePerson" class="primary" :loading="loading">Сохранить</v-btn>
          <v-btn class="ml-3" @click.stop="editDialog=false">Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-if="person._key"
      v-model="inviteDialog"
      max-width="600px"
      :fullscreen="$vuetify.breakpoint.xsOnly"
    >
      <v-card>
        <v-card-title>Отправить приглашение</v-card-title>
        <v-card-text>
          <v-form ref="inviteForm" v-model="inviteFormValid">
            <v-alert v-if="alertText" type="info" :value="alertText">{{alertText}}</v-alert>Введите e-mail, принадлежащий
            <strong>{{person.name}} {{person.surname}}</strong>:
            <v-text-field
              name="email"
              label="e-mail"
              type="email"
              v-model="email"
              required
              :rules="[rules.required, rules.email]"
            ></v-text-field>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-btn
            @click.stop="submitInviteForm"
            class="primary"
            :loading="loading"
            :disabled="!!alertText"
          >Пригласить</v-btn>
          <v-spacer></v-spacer>
          <v-btn @click.stop="inviteDialog=false">Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <image-upload-croppa ref="croppaUpload" :person="person"></image-upload-croppa>
  </v-container>
</template>

<script>
import axiosInst from "@/utils/axios-instance";

export default {
  name: "Profile",
  data() {
    return {
      editDialog: false,
      inviteDialog: false,
      inviteFormValid: true,
      email: null,
      alertText: null
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    person() {
      return this.$store.state.person;
    },
    loading() {
      return this.$store.state.loading;
    },
    rules() {
      return this.$store.state.rules;
    }
  },
  methods: {
    loadProfile() {
      axiosInst
        .get(`/api/person/profile/${this.$route.params.key}`)
        .then(resp => {
          this.$store.commit("setPerson", resp.data.profile);
        })
        .catch(error => {
          this.$store.dispatch("axiosErrorHandle", error);
        });
    },
    deletePerson() {
      if (confirm(`Подтвердить удаление: ${this.person.name}?`)) {
        // todo: сделать красиво
        axiosInst
          .delete(`/api/person/${this.person._key}`)
          .then(resp => {
            this.$router.push("/tree/" + resp.data.redirKey); // переход на единственного rel (либо на user)
          })
          .catch(error => {
            this.$store.dispatch("axiosErrorHandle", error);
          });
      }
    },
    updatePerson() {
      if (this.person.rod instanceof Object) {
        this.person.rod = this.person.rod._id;
      } else if (this.person.rod === undefined) {
        this.person.rod = null;
      }
      axiosInst
        .post(`/api/person/update/${this.person._key}`, {
          person: this.person
        })
        .then(resp => {
          this.editDialog = false;
        })
        .catch(error => {
          this.$store.dispatch("axiosErrorHandle", error);
        });
    },
    submitInviteForm() {
      if (this.$refs.inviteForm.validate()) {
        axiosInst
          .post(`/api/user/invite/${this.person._key}`, {
            email: this.email
          })
          .then(resp => {
            this.alertText = "Приглашение отправлено";
          })
          .catch(error => {
            this.$store.dispatch("axiosErrorHandle", error);
          });
      }
    }
  },
  created() {
    if (!this.person) this.loadProfile();
  }
};
</script>
