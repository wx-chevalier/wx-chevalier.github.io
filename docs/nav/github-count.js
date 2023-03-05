var __assign =
  (this && this.__assign) ||
  function() {
    return (__assign =
      Object.assign ||
      function(t) {
        for (var i, a = 1, s = arguments.length; a < s; a++)
          for (var n in (i = arguments[a]))
            Object.prototype.hasOwnProperty.call(i, n) && (t[n] = i[n]);
        return t;
      }).apply(this, arguments);
  };
var a = (function() {
  function t(t, i, a) {
    var u = this;
    (this.target = t),
      (this.endVal = i),
      (this.options = a),
      (this.version = "2.0.0"),
      (this.defaults = {
        startVal: 0,
        decimalPlaces: 0,
        duration: 2,
        useEasing: !0,
        useGrouping: !0,
        smartEasingThreshold: 999,
        smartEasingAmount: 333,
        separator: ",",
        decimal: ".",
        prefix: "",
        suffix: ""
      }),
      (this.finalEndVal = null),
      (this.useEasing = !0),
      (this.countDown = !1),
      (this.error = ""),
      (this.startVal = 0),
      (this.paused = !0),
      (this.count = function(t) {
        u.startTime || (u.startTime = t);
        var i = t - u.startTime;
        (u.remaining = u.duration - i),
          u.useEasing
            ? u.countDown
              ? (u.frameVal =
                  u.startVal -
                  u.easingFn(i, 0, u.startVal - u.endVal, u.duration))
              : (u.frameVal = u.easingFn(
                  i,
                  u.startVal,
                  u.endVal - u.startVal,
                  u.duration
                ))
            : u.countDown
            ? (u.frameVal =
                u.startVal - (u.startVal - u.endVal) * (i / u.duration))
            : (u.frameVal =
                u.startVal + (u.endVal - u.startVal) * (i / u.duration)),
          u.countDown
            ? (u.frameVal = u.frameVal < u.endVal ? u.endVal : u.frameVal)
            : (u.frameVal = u.frameVal > u.endVal ? u.endVal : u.frameVal),
          (u.frameVal = Math.round(u.frameVal * u.decimalMult) / u.decimalMult),
          u.printValue(u.frameVal),
          i < u.duration
            ? (u.rAF = requestAnimationFrame(u.count))
            : null !== u.finalEndVal
            ? u.update(u.finalEndVal)
            : u.callback && u.callback();
      }),
      (this.formatNumber = function(t) {
        var i,
          a,
          s,
          n,
          e,
          r = t < 0 ? "-" : "";
        if (
          ((i = Math.abs(t).toFixed(u.options.decimalPlaces)),
          (s = (a = (i += "").split("."))[0]),
          (n = 1 < a.length ? u.options.decimal + a[1] : ""),
          u.options.useGrouping)
        ) {
          e = "";
          for (var o = 0, l = s.length; o < l; ++o)
            0 !== o && o % 3 == 0 && (e = u.options.separator + e),
              (e = s[l - o - 1] + e);
          s = e;
        }
        return (
          u.options.numerals &&
            u.options.numerals.length &&
            ((s = s.replace(/[0-9]/g, function(t) {
              return u.options.numerals[+t];
            })),
            (n = n.replace(/[0-9]/g, function(t) {
              return u.options.numerals[+t];
            }))),
          r + u.options.prefix + s + n + u.options.suffix
        );
      }),
      (this.easeOutExpo = function(t, i, a, s) {
        return (a * (1 - Math.pow(2, (-10 * t) / s)) * 1024) / 1023 + i;
      }),
      (this.options = __assign({}, this.defaults, a)),
      (this.formattingFn = this.options.formattingFn
        ? this.options.formattingFn
        : this.formatNumber),
      (this.easingFn = this.options.easingFn
        ? this.options.easingFn
        : this.easeOutExpo),
      (this.startVal = this.validateValue(this.options.startVal)),
      (this.frameVal = this.startVal),
      (this.endVal = this.validateValue(i)),
      (this.options.decimalPlaces = Math.max(this.options.decimalPlaces)),
      (this.decimalMult = Math.pow(10, this.options.decimalPlaces)),
      this.resetDuration(),
      (this.options.separator = String(this.options.separator)),
      (this.useEasing = this.options.useEasing),
      "" === this.options.separator && (this.options.useGrouping = !1),
      (this.el = "string" == typeof t ? document.getElementById(t) : t),
      this.el
        ? this.printValue(this.startVal)
        : (this.error = "[CountUp] target is null or undefined");
  }
  return (
    (t.prototype.determineDirectionAndSmartEasing = function() {
      var t = this.finalEndVal ? this.finalEndVal : this.endVal;
      this.countDown = this.startVal > t;
      var i = t - this.startVal;
      if (Math.abs(i) > this.options.smartEasingThreshold) {
        this.finalEndVal = t;
        var a = this.countDown ? 1 : -1;
        (this.endVal = t + a * this.options.smartEasingAmount),
          (this.duration = this.duration / 2);
      } else (this.endVal = t), (this.finalEndVal = null);
      this.finalEndVal
        ? (this.useEasing = !1)
        : (this.useEasing = this.options.useEasing);
    }),
    (t.prototype.start = function(t) {
      this.error ||
        ((this.callback = t),
        0 < this.duration
          ? (this.determineDirectionAndSmartEasing(),
            (this.paused = !1),
            (this.rAF = requestAnimationFrame(this.count)))
          : this.printValue(this.endVal));
    }),
    (t.prototype.pauseResume = function() {
      this.paused
        ? ((this.startTime = null),
          (this.duration = this.remaining),
          (this.startVal = this.frameVal),
          this.determineDirectionAndSmartEasing(),
          (this.rAF = requestAnimationFrame(this.count)))
        : cancelAnimationFrame(this.rAF),
        (this.paused = !this.paused);
    }),
    (t.prototype.reset = function() {
      cancelAnimationFrame(this.rAF),
        (this.paused = !0),
        this.resetDuration(),
        (this.startVal = this.validateValue(this.options.startVal)),
        (this.frameVal = this.startVal),
        this.printValue(this.startVal);
    }),
    (t.prototype.update = function(t) {
      cancelAnimationFrame(this.rAF),
        (this.startTime = null),
        (this.endVal = this.validateValue(t)),
        this.endVal !== this.frameVal &&
          ((this.startVal = this.frameVal),
          this.finalEndVal || this.resetDuration(),
          this.determineDirectionAndSmartEasing(),
          (this.rAF = requestAnimationFrame(this.count)));
    }),
    (t.prototype.printValue = function(t) {
      var i = this.formattingFn(t);
      "INPUT" === this.el.tagName
        ? (this.el.value = i)
        : "text" === this.el.tagName || "tspan" === this.el.tagName
        ? (this.el.textContent = i)
        : (this.el.innerHTML = i);
    }),
    (t.prototype.ensureNumber = function(t) {
      return "number" == typeof t && !isNaN(t);
    }),
    (t.prototype.validateValue = function(t) {
      var i = Number(t);
      return this.ensureNumber(i)
        ? i
        : ((this.error = "[CountUp] invalid start or end value: " + t), null);
    }),
    (t.prototype.resetDuration = function() {
      (this.startTime = null),
        (this.duration = 1e3 * Number(this.options.duration)),
        (this.remaining = this.duration);
    }),
    t
  );
})();
window.CountUp = a;

(function(exports) {
  exports.githubStars = function(repo, callback) {
    var xmlhttp = new XMLHttpRequest(),
      url = ["https://api.github.com"],
      useCallback = typeof callback == "function";

    //count the stars
    function countStars(response) {
      //don't care, just make it an array
      if (!(response instanceof Array)) {
        response = [response];
      }
      //start the count
      var stars = 0;

      for (var i in response) {
        stars += parseInt(response[i].stargazers_count);
      }

      return stars;
    }

    //determine if we're looking at a collection or a single repo
    repo = repo.split("/");

    if (repo.length === 1) {
      url.push("users", repo[0], "repos");
    } else {
      url.push("repos", repo[0], repo[1]);
    }

    //check if we were given a callback, if so we set that up
    if (useCallback) {
      xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          callback(countStars(JSON.parse(xmlhttp.responseText)));
        }
      };
    }

    xmlhttp.open("GET", `${url.join("/")}?per_page=100`, useCallback);
    //set the github media header
    xmlhttp.setRequestHeader("Accept", "application/vnd.github.v3+json");
    xmlhttp.send();

    if (!useCallback) {
      //no callback, just wait for the response
      return countStars(JSON.parse(xmlhttp.responseText)) || 0;
    }
  };
})(typeof exports !== "undefined" ? exports : window);
