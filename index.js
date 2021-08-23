function ppyUrl(sid) {
  return 'https://osu.ppy.sh/d/' + sid;
}
function sayobotUrl(sid) {
  return 'https://txy1.sayobot.cn/beatmaps/download/' + sid;
}
// beatmap api response example:
// [{
//   bmid: 953586,
//   bmdid: 443751,
//   artist: "Chino(CV.Minase Inori)",
//   title: "Shinsaku no Shiawase wa Kochira!",
//   version: "Happy~!",
// }]

function fetchBeatmapInfo(bid) {
  return fetch('https://www.osupink.org/api/get_bm.php?b=' + bid, {
    method: 'GET',
  }).then(function(res){
    if (!res.ok) throw new Error('serve error, please try again later.');
    return res.json()
  }).then(function(beatmaps){
    if (!beatmaps.length) throw new Error('beatmapId ' + bid + 'was not found.');
    return beatmaps[0];
  });
}

// records api response example:
// [{
//   bid: 953586,
//   mods: 'HD HR',
//   pp: 243,
//   rank: 'A',
// },{...},...],

function fetchRecords(name, limit, mode) {
  limit = limit ? limit : 20;
  mode = mode ? mode : 0;
  var query = '?user=' + name +
              '&limit=' + limit +
              '&mode=' + mode;
  return fetch('https://www.osupink.org/api/get_bp.php' + query, {
    method: 'GET',
  }).then(function(res){
    if (!res.ok) throw new Error('serve error, please try again later.');
    return res.json();
  }).then(function(scores){
    if (!scores.length) throw new Error('no records, please check the username.');
    return scores;
  });
}

Vue.use(Toasted, {
   theme: "primary", 
   position: "bottom-center", 
   duration : 3000,
});

Vue.use(VueRouter);

var router = new VueRouter({
  mode: 'hash',
  routes: [
    { path: '/:name' }
  ]
});

var app = new Vue({
  router,
  el: '#app',
  data: {
    records: [],
  },
  computed: {
    sortedRecords: function() {
      return this.records.sort(function(a,b){
        if (a.pp < b.pp) return 1;
        if (a.pp > b.pp) return -1;
        return 0;
      });
    },
    name: {
      get: function() {
        return this.$route.params.name || '';
      },
      set: function(name) {
        this.$router.push({
          path: name,
          query: this.$route.query,
        });
        window.scrollTo(0, 0);
      },
    },
    limit: {
      get: function() {
        return this.$route.query.limit || 20;
      },
      set: function(limit) {
        this.updateQueryPart({
          limit,
        });
      },
    },
    mode: {
      get: function() {
        return this.$route.query.mode || 0;
      },
      set: function(mode) {
        this.updateQueryPart({
          mode,
        });
      },
    },
  },
  methods: {
    submit: function() {
      this.records = [];
      var vue = this;

      NProgress.start();
      fetchRecords(this.name,this.limit,this.mode)
      .then(function(scores){
        scores.forEach(function(score){
          var bid = score.beatmap_id;
          fetchBeatmapInfo(bid)
          .then(function(beatmap){
            var record = {
              bid,
              sid: beatmap.bmdid,
              artist: beatmap.artist,
              title: beatmap.title,
              diff: beatmap.version,
              mods: score.mods,
              pp: score.pp,
              rank: score.rank,
            };
            vue.records.push(record);
            NProgress.set(vue.records.length / scores.length);
            if (vue.records.length === scores.length) {
              this.recordsLoaded = true;
            }
          });
        });
      }).catch(function(error){
        console.log(error);
        NProgress.done();
        vue.$toasted.show(error);
      });
    },
    parseInt(pp) {
      return Math.round(pp);
    },
    beatmapUrl: function(bid) {
      return 'https://osu.ppy.sh/b/' + bid;
    },
    ppyUrl: function(bid) {
      return ppyUrl(bid);
    },
    sayobotUrl: function(bid) {
      return sayobotUrl(bid);
    },
    rankImgUrl: function(rank) {
      return 'https://s.ppy.sh/images/' + rank + '_small.png';
    },
    downloadAll: function() {
      this.records.forEach(function(record) {
        var iframe = document.createElement('iframe');
        iframe.src = ppyUrl(record.sid);
        iframe.style.display = "none";
        document.documentElement.appendChild(iframe);
      });
    },
    updateQueryPart(part) {
      let query = Object.assign({}, this.$route.query, part);
      Object.keys(query).forEach(key => {
        if (!query[key]) {
          delete query[key]
        }
      });
      this.$router.replace({
        path: this.$route.path,
        query,
      })
    },
  },
  mounted: function() {
    setTimeout(function() {
      this.$toasted.show('welcome to BP query!');
    }.bind(this),3000);

    if (this.name) {
      this.submit();
    } else {
      this.$refs.name.focus();
    }
  },
});
