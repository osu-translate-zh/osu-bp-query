function ppyUrl(sid) {
  return 'https:/osu.ppy.sh/d/' + sid
}
function bloodcatUrl(sid) {
  return 'http://bloodcat.osupink.org/d/' + sid
}

// fetch response example:
// [{
//   bid: 953586,
//   sid: 443751,
//   title: 'Chino(CV.Minase Inori) - Shinsaku no Shiawase wa Kochira!',
//   diff: 'Happy~!',
//   mods: 'HD HR',
//   pp: 243,
//   rank: 'A',
// },{...}],

var app = new Vue({
  el: '#app',
  data: {
    tips: '',
    loading: false,

    i: 1,
    animatedString: '',
    
    name: '',
    limit: 20,
    mode: 0,

    records: [],
  },
  computed: {

  },
  methods: {
    submit: function() {
      this.loading = true;
      this.records = [];

      var self = this;
      var args = '?user=' + this.name +
                 '&limit=' + this.limit +
                 '&mode=' + this.mode;
      fetch('https://www.osupink.org/api/get_bp.php' + args, {
        method: 'GET',
      }).then(function(res){
        return res.json();
      }).then(function(scores){
        if (!scores.length) {
          self.tips = 'no records, please check the username.';
        }
        scores.forEach(function(score) {
          var record = {
            bid: score.beatmap_id,
            sid: 443751, // TODO
            title: 'the truth that you leave', // TODO
            diff: 'piano', // TODO
            mods: score.mods,
            pp: parseInt(score.pp),
            rank: score.rank,
          };
          self.records.push(record);
        });
        self.loading = false;
      }).catch(function(error) {
        self.loading = false;
        console.log(error);
        if (!res.ok) {
          self.tips = 'serve error, please try again later.';
        }
      });
    },
    sliceNext: function() {
      this.animatedString = '......'.slice(-(this.i++ % 6));
    },
    beatmapUrl: function(bid) {
      return 'https://osu.ppy.sh/b/' + bid
    },
    ppyUrl: function(bid) {
      return ppyUrl(bid)
    },
    bloodcatUrl: function(bid) {
      return bloodcatUrl(bid)
    },
    rankImgUrl: function(rank) {
      return 'https://s.ppy.sh/images/' + rank + '_small.png'
    },
    downloadAll: function(name) {
      this.records.forEach(function(record) {
        var iframe = document.createElement('iframe');
        iframe.src = ppyUrl(record.sid);
        iframe.style.display = "none";
        document.documentElement.appendChild(iframe);
      });
    },
  },
  mounted: function() {
    this.tips = 'Type username and query BPs.';
    window.setInterval(this.sliceNext.bind(this), 500);
  },
});