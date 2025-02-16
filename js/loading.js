let loading = document.querySelector('.loading');

let home = document.getElementById('home');
let about = document.getElementById('about');
let services = document.getElementById('services');
let skills = document.getElementById('skills');
let footer = document.getElementById('footer');

document.addEventListener("DOMContentLoaded", function() {


    home.style.display = 'none';
    about.style.display = 'none';
    services.style.display = 'none';
    skills.style.display = 'none';
    footer.style.display = 'none';


    setTimeout(function() {
        
        loading.style.display = 'none';
        
        
        home.style.display = '';
        about.style.display = '';
        services.style.display = '';
        skills.style.display = '';
        footer.style.display = '';
    }, 3000); 
});