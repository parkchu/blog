const comment_div = document.querySelector(".comment")
const comment_form = comment_div.querySelector(".js-form")
const comment_input = comment_form.querySelector('input')
const h5 = comment_div.querySelector(".js-h5")
const APIURL = 'http://localhost:8000/comment/'
const USER = comment_div.id
const POST_ID = parseInt(comment_form.id)
const URL = (window.location.href)
URL.toString()
console.log(URL)
let comment = []

function confirmChange(event){
    event.preventDefault()
    const change = event.target
    const div = change.parentNode
    const span = div.querySelector(".comment")
    const form = div.querySelector('.change-form')
    const input = div.querySelector('.change-input')
    const a = div.querySelector('.change')
    form.classList.add('block')
    span.innerText = input.value
    span.classList.remove('block')
    a.classList.remove('block')
    fetch(`http://localhost:8000/comment/${span.id}/`).then(function(res){
        return res.json()
    }).then(function(json){
        fetch(`http://localhost:8000/comment/${span.id}/`, {
            method: 'PUT',
            body: JSON.stringify({
                user: json.user,
                comment: input.value,
                post_id: json.post_id,
                created: json.created,
                id: span.id
            }),
            headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
        })
    })
}

function changeComment(event){
    event.preventDefault()
    const form = document.createElement('form')
    const input = document.createElement('input')
    const change = event.target
    const div = change.parentNode
    const span = div.querySelector(".comment")
    const a = div.querySelector('.change')
    span.classList.add('block')
    a.classList.add('block')
    form.classList.add('change-form')
    input.classList.add('change-input')
    form.appendChild(input)
    input.value = span.innerText
    input.type = "text"
    div.insertBefore(form, div.childNodes[2])
    form.addEventListener("submit", confirmChange)
}

function delComment(event){
    event.preventDefault()
    const a = event.target
    const div = a.parentNode
    const span = div.querySelector(".comment")
    comment_div.removeChild(div)
    fetch(`http://localhost:8000/comment/${span.id}/`, {
        method: 'DELETE'
    })
}

function addComment(current_comment){
    const div = document.createElement('div')
    const a = document.createElement('a')
    const a2 = document.createElement('a')
    const br = document.createElement('br')
    const p = document.createElement('span')
    const p2 = document.createElement('span')
    a.innerText = '수정 '
    a.href = '#/'
    a.classList.add('change')
    a.addEventListener("click", changeComment)
    a2.innerText = ' 삭제'
    a2.href = '#/'
    a2.addEventListener("click", delComment)
    p.innerText = `${USER}: `
    p2.innerText = current_comment
    p2.classList.add("comment")
    const commentObj = {
        user: USER,
        comment: current_comment,
        post_id: POST_ID
    }
    console.log(commentObj)
    fetch(APIURL, {
        method: 'POST',
        body: JSON.stringify(commentObj),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(function(res){
        return res.json()
    }).then(function(json){
        p2.id = json.id
    })
    div.appendChild(p)
    div.appendChild(p2)
    div.appendChild(br)
    div.appendChild(a)
    div.appendChild(a2)
    comment_div.insertBefore(div, comment_div.childNodes[6])
}

function loadComment(text, user, id){
    const div = document.createElement('div')
    const a = document.createElement('a')
    const a2 = document.createElement('a')
    const p = document.createElement('span')
    const p2 = document.createElement('span')
    const br = document.createElement('br')
    p.innerText = `${user}: `
    p2.innerText = text
    p2.classList.add("comment")
    p2.id = id
    a.innerText = '수정 '
    a.href = '#/'
    a.classList.add('change')
    a.addEventListener("click", changeComment)
    a2.innerText = ' 삭제'
    a2.href = '#/'
    a2.addEventListener("click", delComment)
    div.appendChild(p)
    div.appendChild(p2)
    if (user === USER){
        div.appendChild(br)
        div.appendChild(a)
        div.appendChild(a2)
        comment_div.appendChild(div)
    } else {
        comment_div.appendChild(div)
        comment_div.appendChild(br)
    }
}

function handleSubmit(event){
    event.preventDefault();
    current_comment = comment_input.value
    comment_input.value = ""
    addComment(current_comment)

}

function loginWhether(user){
    const a = document.createElement('a')
    const small = document.createElement('small')
    small.innerText = "(댓글을 남기고 싶으시면 로그인을 해주세요)"
    a.innerText = "로그인"
    a.href = "/accounts/login/"
    if(user === 'AnonymousUser'){
        comment_form.classList.add('block')
        h5.appendChild(small)
        h5.appendChild(a)
    } else {
        comment_form.classList.remove('block')
    }
}

function init(){

    comment.forEach(function(obj){
        loadComment(obj.comment, obj.user, obj.id)
    })


    loginWhether(USER)
    comment_form.addEventListener("submit", handleSubmit)
}

fetch(`http://localhost:8000/comment/filter/${POST_ID}/`).then(function(json){
    return json.json()
}).then(function(obj){
    comment = obj
    console.log(comment)
    comment.sort(function(a, b){
        return a.created > b.created ? -1 : a.created < b.created ? 1 : 0
    })
    console.log(POST_ID)
    init()
})