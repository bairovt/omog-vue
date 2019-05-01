import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'
import jwtDecode from 'jwt-decode'
import axiosInst from '@/utils/axios-instance'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    user: null,
    person: {
      _key: null,
      commonAncestorKey: null,
    },
    treeView: 'tree', // 'path'
    rods: [], // 2-level nested rods (1-st level 'subethnos')
    loading: false,
    error: null,
    rightDrawer: false,
    potential: {
      parents: [],
      children: [],
    },
    relateDialog: false,
    rules: {
      required: (v) => !!v || 'Обязательное поле',
      email: (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,5})+$/.test(v) || 'E-mail must be valid'
    }
  },
  getters: {
    errorDialog(state) {
      return !!(state.error && state.error.dialog);
    }
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
      if (!payload) return // user set to null
      state.user.hasRoles = function (roles) {
        if (roles === undefined) return true // все имеют пустую роль
        if (!state.user.roles) return false;
        if (state.user.roles.includes('admin')) return true;
        let allowed = false;
        roles.forEach(role => {
          if (state.user.roles.includes(role)) allowed = true
        })
        return allowed
      }
    },
    setPerson(state, payload) {
      state.person = payload
    },
    setPersonPic(state, payload) {
      state.person.pic = payload
    },
    setLoading(state) {
      state.loading = true
    },
    resetLoading(state) {
      state.loading = false
    },
    setError(state, payload) {
      state.error = payload.appError
      if (!state.error.text) Vue.set(state.error, 'text', payload.defText)
      if (payload.dialog) Vue.set(state.error, 'dialog', true)
    },
    clearError(state) {
      state.error = null
    },
    setRightDrawer(state, payload) {
      state.rightDrawer = payload
    },
    setPotential(state, payload) {
      state.potential = payload;
    },
    setRods(state, payload) {
      state.rods = payload
    },
  },
  actions: {
    axiosErrorHandle({
      commit,
      dispatch
    }, error) {
      commit('resetLoading') // остановить крутилку. resp interceptor does not hit when error
      if (error.response) {
        // The request was made, but the server responded with a status code
        // that falls out of the range of 2xx
        console.error(error.response)
        let appError = {
          status: error.response.status,
          text: error.response.data.errorMsg || null
        }
        switch (error.response.status) {
          // bad request
          case 400:
            commit('setError', {
              appError,
              defText: 'bad request',
              dialog: true
            })
            break
            // auth error: ie. invalid jwt token
          case 401:
            if (router.history.current.path !== '/signin') {
              console.error('auth error: redirect to signin')
              dispatch('logout')
            } else {
              // if (!error.text) error.text = 'Ошибка авторизации'
              commit('setError', {
                appError,
                defText: 'Ошибка авторизации'
              })
            }
            break
          case 403:
            // if (!error.text) error.text = 'Запрещено'
            commit('setError', {
              appError,
              defText: 'Запрещено',
              dialog: true
            })
            break
          case 404:
            router.replace('/404')
            break
          default: // should never get this
            commit('setError', {
              appError,
              defText: 'Ошибка сервера',
              dialog: true
            })
        }
      } else {
        // Something happened in setting up the request that triggered an Error (when cancel too)
        console.error('Something happened in setting up the request: ' + error);
      }
    },
    autoSingIn({
      commit,
      dispatch
    }) {
      const authToken = window.localStorage.getItem('authToken')
      if (authToken) {
        commit('setUser', jwtDecode(authToken)); // todo: разлогинивание конкретного юзера с сервера
      } else {
        router.push('/signin')
      }
    },
    logout({
      commit
    }) {
      const person = {
        _key: null,
        commonAncestorKey: null,
      }
      commit('setUser', null)
      commit('setPerson', person)
      window.localStorage.removeItem('authToken')
      router.push('/signin')
    },
    loadAllRods({
      commit,
      dispatch
    }) {
      axiosInst.get('/api/rod/all') // загрузка всех родов при создании App
        .then(resp => {
          commit('setRods', resp.data.rods);
        })
        .catch(error => {
          dispatch('axiosErrorHandle', error)
        });
    },
    fetchPotentialParentsAndChildren({
      commit,
      dispatch
    }, person_key) {
      axiosInst
        .get(`/api/person/${person_key}/potential_parents_and_children`)
        .then(resp => {
          commit('setPotential', resp.data.potential);
        })
        .catch(error => {
          dispatch('axiosErrorHandle', error);
        });
    },
  }
})