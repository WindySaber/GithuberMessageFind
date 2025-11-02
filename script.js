const img = document.querySelector('.avatar');//
const input = document.getElementById("usernameInput");
const btn = document.getElementById('searchButton');
const profile = document.querySelector('.profile');
const error = document.getElementById("error");
const loading = document.getElementById("loading");

function usernameLimited(username){
    const regex = /^[a-zA-Z0-9]([a-zA-Z0-9-_]){0,38}$/  //[]

    if(!username) throw new Error('请输入用户名!'); //
    if(username.length > 39) throw new Error('用户名长度不能超过39个字符!');
    if(!regex.test(username)) throw new Error('用户名格式不正确。只能包含字母、数字、连字符（-）或下划线（_），且不能以连字符或下划线开头');
}

function showError(message){
    error.textContent = message;
    error.style.display = "block";
    profile.style.display = "none";
}

function hideError(){
    error.style.display = "none";
}

function showLoading(){
    loading.style.display = "block";
    profile.style.display = "none";
}

function hideLoading(){
    loading.style.display = "none";
}

function getData(data){
    img.src = data.avatar_url;
    document.getElementById('name').textContent = data.name;
    document.getElementById('username').textContent = `@${data.login}`;

    const bioElement = document.getElementById('bio');
    if (data.bio) {
        bioElement.textContent = data.bio;
        bioElement.style.display = 'block';//
    } else {
        bioElement.style.display = 'none';//
    }

    document.getElementById('publicRepos').textContent = data.public_repos;
    document.getElementById('followers').textContent = data.followers;
    document.getElementById('following').textContent = data.following;

    document.getElementById('company').textContent = data.company || "-";
    document.getElementById('location').textContent = data.location || "-";

    if(data.blog){
        const blog = document.createElement('a');//
        blog.href = data.blog;//
        blog.textContent = data.blog;   
        blog.style.color = '#58a6ff';
        document.getElementById('blog').innerHTML = "";
        document.getElementById('blog').appendChild(blog);//
    }
    else document.getElementById('blog').textContent = "-";
    if(data.html_url){
        const github = document.createElement('a');
        github.href = data.html_url;
        github.textContent = data.html_url;   
        github.style.color = '#58a6ff';
        document.getElementById('html_url').innerHTML = "";
        document.getElementById('html_url').appendChild(github);
    }
    else document.getElementById('html_url').textContent = "-";
    if(data.twitter_username){//
        const twitter = document.createElement('a');
        twitter.href = `https://twitter.com/${data.twitter_username}`;
        twitter.textContent = `@${data.twitter_username}`;   
        twitter.style.color = '#58a6ff';
        document.getElementById('twitter').innerHTML = "";
        document.getElementById('twitter').appendChild(twitter);
    }
    else document.getElementById('twitter').textContent = "-";

    const date = new Date(data.created_at);//
    document.getElementById('createdAt').textContent = date.toLocaleDateString("zh-CN",{//
        year:"numeric",
        month:"long",//
        day:"numeric"
    });

    profile.style.display = 'block';////
}

async function searchUser(){ //
    const username = input.value;

    hideError();
    try{
        usernameLimited(username);

        showLoading();
        
        const api = `https://api.github.com/users/${username}`;//

        const response = await fetch(api,{//
            method:"GET",//
            headers:{
                'Accept':'application/json',//'application/'
                'User-Agent':'GitHub-User-Profile-Viewer'//
            }
        });

        if(!response.ok){//
            if(response.status == 404) throw new Error('未找到该用户，请检查用户名是否正确');
            else if(response.status == 403) throw new Error('请求被限制，请稍后再试');
            else if(response.status == 422) throw new Error('用户名格式不正确');
            else throw new Error(`请求失败：${response.status} ${response.statusText}`);
        }

        const data = await response.json();//

        getData(data);
    }catch(error){//
        if(error instanceof TypeError && error.message.includes('Failed to fetch')) 
            showError('网络连接失败，请检查您的网络连接');
        if(error instanceof SyntaxError)  
            showError('服务器返回的数据格式不正确');
        else 
            showError(error.message || '发生未知错误，请稍后重试');
    }finally {
        hideLoading();
    }
    
}


btn.addEventListener("click",function(){
    searchUser();
});

input.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchUser();
    }
});
