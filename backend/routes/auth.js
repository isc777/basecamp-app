var express = require('express');
var router = express.Router();

router.post('/login', function(req, res) {
  const { username, password } = req.body;
  // 這裡可以加資料庫驗證
  if (username === "test" && password === "1234") {
    res.json({ success: true, token: "fake-jwt-token" });
  } else {
    res.status(401).json({ success: false });
  }
});

module.exports = router;