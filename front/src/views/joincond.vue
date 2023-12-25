<template>
  <div>
    <h1>회원가입 약관</h1>
    <textarea v-model="conds" style="font-size: 16px; height: 200px;"></textarea>
    <br>
    <input type="checkbox" v-model="agreed"> 약관에 동의합니다.
    <br>
    <button @click="goToJoin" :disabled="!agreed">회원가입</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      conds: `약관내용`,
      agreed: false
    };
  },
  methods: {
    goToJoin() {
      if (this.agreed) {
        this.$router.push('/join');
      } else {
        alert('약관에 동의해주세요.');
      }
    }
  }
};
</script>