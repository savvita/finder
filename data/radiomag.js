const test = async () => {
    const url = "https://www.rcscomponents.kiev.ua/modules.php?name=Asers_Shop&s_op=productlist_json&group_id=215&lang=ukrainian&v=9436212882a4c105dcdfd37b89d85a5e47df57da";
    await fetch(url, {
        method: 'get'
    })
    .then((response) => response.text())
    .then(response => console.log(response))
    .catch((err) => {
        console.log(err);
    });
}

export default {
    test: test
};