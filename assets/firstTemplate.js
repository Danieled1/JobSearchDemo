//Localstorage
const localStorageSavedJobs = localStorage.getItem('jobs')
    ? JSON.parse(localStorage.getItem('jobs'))
    : []
// URLS
let url = 'https://remotive.com/api/remote-jobs?limit=50&category=&search=&company_name='

const mainArea = document.querySelector('#divArea')

const getData = async() => {
    try{
        url = 'https://remotive.com/api/remote-jobs?limit=50&category=&search=&company_name='
        mainArea.innerHTML = ''
        const response = await fetch(url)
        const data = await response.json()
        const { jobs } = data

        //Print Choosen jobs
        buildJobCards(jobs)
        
    } catch(err) {
        console.log(err);
    }
}
// getData()

const showDropdowns = async() => {
    
    const dropDownMenu = document.querySelector('.dropdown-menu')
    url = `https://remotive.com/api/remote-jobs/categories`
    const response = await fetch(url)
    const data = await response.json()
    const { jobs } = data
    // console.log(jobs);

    dropDownMenu.innerHTML = ''
    jobs.map(item => {
        const li = document.createElement('li')
        const a = document.createElement('a')
        a.innerHTML = item.name
        a.className = 'dropdown-item'
        li.append(a)
        dropDownMenu.append(li)
        a.addEventListener('click', async() => {
            url = `https://remotive.com/api/remote-jobs?limit=50&category=${item.slug}`
            mainArea.innerHTML = ''
            const response = await fetch(url)
            const data = await response.json()
            const { jobs } = data
            buildJobCards(jobs)
            
        })
    })
}

const buildJobCards = (objJobs) => {
    objJobs.map(item => {
        const card = document.createElement('div')
        const cardBody = document.createElement('div')
        const companyName = document.createElement('h5')
        const companyLogo = document.createElement('img')
        const jobDescription = document.createElement('div')
        const jobTitle = document.createElement('h3')
        const salary = document.createElement('p')
        const saveBtn = document.createElement('button')
        const seeMoreBtn = document.createElement('button')
        const jobType = document.createElement('p')
        const divBtns = document.createElement('div')

        //Bootstrap classes design method
        card.className = 'card'
        card.style.width = '18rem'
        cardBody.className = 'card-body'

        companyName.className = 'card-title'
        companyName.innerHTML = item.company_name
        
        jobTitle.className = 'card-title'
        jobTitle.innerHTML = item.title

        companyLogo.className = 'card-img-top'
        companyLogo.src = item.company_logo

        salary.className = 'card-text text-center'
        salary.innerHTML = item.salary

        
        jobDescription.classList.add('card-text','fw-light','infoJob','lh-sm')
        jobDescription.setAttribute('contenteditable','true')
        jobDescription.innerHTML = item.description

        jobType.className = 'card-text text-center'
        jobType.innerHTML = '*' + item.job_type
        saveBtn.className = 'btn btn-outline-danger'
        saveBtn.innerText = 'Save This'
        // if the key is not present in the local storage
        saveBtn.addEventListener('click', () => {
            if(localStorage.getItem(item.id) === null){
                console.log(localStorage.getItem(item.id));
                localStorageSavedJobs.push(item.id)
                console.log(localStorageSavedJobs);
                
                localStorage.setItem('jobs',JSON.stringify(localStorageSavedJobs))

                saveBtn.innerText = 'Remove'
                saveBtn.className = 'btn btn-danger'
            } else {
                
                localStorage.removeItem(item.id)
                saveBtn.innerText = 'Save This'
                saveBtn.className = 'btn btn-danger'
            }
        })

        seeMoreBtn.className = 'btn btn-dark'
        seeMoreBtn.innerText = 'See Full JOB'


        divBtns.className = 'd-grid gap-2 col-6 mx-auto'
        divBtns.append(saveBtn,seeMoreBtn)
        cardBody.append(salary,jobDescription)
        card.append(companyName,companyLogo,jobTitle,cardBody,divBtns,jobType)
        mainArea.append(card)
    })
    
}