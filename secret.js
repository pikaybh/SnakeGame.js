function please_do_not_hack(score) {
    // login("admin@pikaybh.com", "admin!@#");
    update(score);
}

function update(_score) {
    // db.collection('product').doc('상품3').set({ 제목 : '변기' })
    db.collection('score').add({ name : 'no_name', score: _score })
    console.log("Up to date!");
}