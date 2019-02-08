<template>
  <v-dialog v-model="croppaDialog" max-width="350px">
    <v-card>
      <!-- todo: align -->
      <v-card-text>
        <croppa
          v-model="myCroppa"
          :width="250"
          :height="250"
          placeholder="Выбрать фото"
          :zoom-speed="10"
          accept="image/*"
          :file-size-limit="0"
          :prevent-white-space="true"
          remove-button-color="grey"
          :remove-button-size="25"
          :quality="2"
          :show-loading="true"
        ></croppa>
        <br>выберите область фото
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click.stop="uploadCroppedImage">Загрузить</v-btn>
        <v-btn flat @click.stop="croppaDialog=false">Отмена</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axiosInst from "@/utils/axios-instance";
import "vue-croppa/dist/vue-croppa.css";

export default {
  name: "ImageUploadCroppa",
  props: ["person"],
  data() {
    return {
      croppaDialog: false,
      myCroppa: {}
    };
  },
  methods: {
    openCroppaDialog() {
      this.myCroppa.chooseFile();
      this.croppaDialog = true;
    },
    uploadCroppedImage() {
      var formData = new FormData();
      this.myCroppa.generateBlob(
        blob => {
          formData.append("pic", blob);
          axiosInst
            .post("/api/upload/pic/" + this.person._key, formData)
            .then(resp => {
              this.$store.commit("setPersonPic", resp.data.pic);
              this.croppaDialog = false;
            })
            .catch(error => {
              this.$store.dispatch("axiosErrorHandle", error);
            });
          // write code to upload the cropped image file (a file is a blob)
        },
        "image/jpeg",
        0.8
      ); // 0.8 - 80% compressed jpeg file
    }
  }
};
</script>

<style scoped>
</style>
