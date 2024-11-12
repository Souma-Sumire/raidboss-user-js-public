if (/^file:\/\/.+\/config\/config\.html$/.test(location.href)) {
    location.href = 'http://souma.diemoe.net/cactbot/ui/config/config.html';
    console.log('已重定向至 souma 修改版 config');
}
