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

      // test use
      window.setTimeout(function() {
        this.records.push({
          bid: 953586,
          sid: 443751,
          title: 'Chino(CV.Minase Inori) - Shinsaku no Shiawase wa Kochira!',
          diff: 'Happy~!',
          mods: 'HD HR',
          pp: 243,
          rank: 'A',
        });
        this.loading = false;
      }.bind(this),3000);
      
      // fetch('').then(function(res){
      //   this.loading = false;
      //   if (!res) {
      //     this.tips = 'serve error, please try again later.';
      //   }
        // this.records = JSON.parse(res);
      // });
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