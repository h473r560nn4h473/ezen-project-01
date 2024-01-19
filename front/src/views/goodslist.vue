<template>
  <main class="content_wrap">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous" />
    <div class="title">
      <h1>상품목록</h1>
    </div>
    <div class="review_wrap">
      <div class="srch_sel_wrap">
        <div class="search_bar">
          <input v-model="keyword" class="search_input" type="text" placeholder="상품명 검색" @keyup.enter="getGoodsList(sortACase)">
          <button class="search_btn" type="submit" @click="getGoodsList(sortACase)"><i class="fa-solid fa-search"></i></button>
        </div>
        <div class="sel_wrap">
          <div class="sel" :class="{ active: optionsActive }" tabindex="0" @click="toggleOptions">
            <span class="sel_txt">{{ sortACase }}</span>
            <i class="fa-solid fa-chevron-down arrow_down"></i>
          </div>
          <div class="sel_list_wrap">
            <div class="sel_list" :style="{ display: optionsActive ? 'block' : 'none' }" >
              <div v-for="(option, index) in options" :key="index" class="sel_opt" :class="{ 'selected': option === sortACase }" @click="handleClick(option, index, $event)">
                <span>{{ option }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="goods_wrap">
        <div class="goods_box" v-for="(goods,i) in pageGoodsList" :key="i">
          <div class="img_frame">
            <img class="goods_img" :src="require(`../../../back/uploads/uploadGoods/` + `${goods.goods_img}`)" />
          </div>
          <div class="goods_txt">
            <div class="goods_name">{{ goods.goods_nm }}</div>
            <div>{{ goods.goods_price }}원</div>
            <div>입고일: {{ formatDateTime(goods.goods_date) }}</div>
          </div>
        </div>
      </div>
      <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
          <ul v-for="i in pageCnt" :key="i" class="pagination justify-content-center">
            <a href="#top" style="text-decoration: none;">
              <li v-if="i != pageNum + 1" class="page-item page-link" @click="setPage(i)">{{ i }}</li>
              <li v-else class="page-item page-link active" @click="setPage(i)">{{ i }}</li>
            </a>
          </ul>
        </ul>
      </nav>
    </div>
  </main>      
</template>

<script>
import axios from 'axios';

export default{
  data() {
    return {
      goodsList: [],
      sortACase: "최근 등록 순",
      options: ['최근 등록 순','오래된 등록 순','가격 높은 순','가격 낮은 순'],
      keyword: '',
      pageGoodsList: [],
      pageNum: 0,
      pageCnt: 0,
      onePageCnt: 12,
      optionsActive: false
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    handleClick(option, param, event) {
      this.handleSelect(option);
      this.sortList(param, event);
    },
    setPage(page) {
      this.pageGoodsList = [];
      this.pageNum = page - 1;
      this.sliceList()
    },
    sliceList() {
      const start = 0 + this.pageNum * this.onePageCnt
      this.pageGoodsList = this.goodsList.slice(start, start + this.onePageCnt);
    },
    async getGoodsList(sortACaseNum) {
      let keyword = 'none';
      if (this.keyword != '') {
        keyword = this.keyword;
      }
      try {
        const response = await axios.get(`http://localhost:3000/goods/goodsList/${sortACaseNum}/${keyword}`);
        this.goodsList = response.data;
        this.pageCnt = Math.ceil(this.goodsList.length / this.onePageCnt);
        this.setPage(1);
      } catch (error) {
        console.error(error);
      }
    },
    sortList(sortNum, event) {
      event.preventDefault();
        if (sortNum == 0) {
          this.sortACase = "최근 등록 순"
        }
        else if (sortNum == 1) {
          this.sortACase = "오래된 등록 순"
        }
        else if (sortNum == 2) {
          this.sortACase = "가격 높은 순"
        }
        else if (sortNum == 3) {
          this.sortACase = "가격 낮은 순"
        }
        this.getGoodsList(sortNum);
        // .then(() => {
        //     this.$router.push({ path: '/goodslist' });
        // })
    },
    formatDateTime(dateTime) {
      const date = new Date(dateTime);
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const formattedDateTime = date.toLocaleDateString("ko-KR", options);
      return formattedDateTime;
    },
    // showDropdown() {
    //     this.dropdownVisible = !this.dropdownVisible;
    // },
    handleSelect(item) {
      this.sortACase = item;
      this.optionsActive = false;
    },
    toggleOptions() {
      this.optionsActive = !this.optionsActive;
    }
  }
}
</script>

<style src="../assets/css/board.css" scoped></style>
<style src="../assets/css/profileInput.css" scoped></style>
<style scoped>
@import "../assets/css/global.css";

.srch_sel_wrap {
  margin: 0 0 50px;
}

.goods_wrap {
  display: grid;
  align-content: stretch;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 40px 20px;
  margin-bottom: 40px;
}

.goods_box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.img_frame {
  width: 200px;
  height: 200px;
}

.goods_txt {
  padding: 20px 10px 0;
  width: 200px;
}

.goods_name {
  font-weight: 500;
  font-size: 18px;
  margin-bottom: 10px;
}
</style>