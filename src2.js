// url requests
let urlCategories = 'https://remotive.com/api/remote-jobs/categories'
let urlCategory = 'https://remotive.com/api/remote-jobs?limit=50&category='
let allJobs = 'https://remotive.com/api/remote-jobs?limit=50'

// Managing local storage, create new jobs array if not exist
let localStorageSavedJobs = localStorage.getItem('jobs')
? JSON.parse(localStorage.getItem('jobs'))
: []

// Decleration of main parts on page
const parentEvents = document.querySelector('#parentEvents')
const jobsSection = document.querySelector('#divArea')
const dropDownMenu = document.querySelector('.dropdown-menu')
const searchForm = document.querySelector('#searchForm')
const loader = document.querySelector('#loader')

let onSaved = false

const fetchingData = event => {
    // Looping through all the events that accour in the parent element(the navbar)
    // And fetch the correct data
    if(event.target !== event.currentTarget){
        let eventName = event.target.innerHTML
        const getData = async() => {
            jobsSection.innerHTML = ''
            try{
                switch (eventName) {
                    case 'All Jobs':
                        showloading()
                        const response = await fetch(allJobs)
                        const data = await response.json()
                        hideLoading()
                        showAllJobs(data.jobs)
    
                    case 'Categories':
                        //Checks if the categories have been uploaded yet
                        showloading()
                        if(dropDownMenu.childNodes.length === 1){
                            const response = await fetch(urlCategories)
                            const data = await response.json()
                            buildCategories(data.jobs)
                            
                        }
                        return null
                    case 'Saved Jobs💝':
                        if(localStorageSavedJobs.length > 0){
                            showloading()
                            localStorageSavedJobs.forEach( async(item) => {
                                jobsSection.append(buildCard(item[0],true))
                                //just select all the savedjobs btns and change their class
                                const btns = jobsSection.querySelectorAll('.remove')
                                btns.forEach(item => {
                                    setElement(item,'btn btn-danger remove','Remove')
                                })
                            }) 
                            hideLoading()
                        }else{
                            jobsSection.append('No jobs saved...')
                        }
                }       
            } catch (err){
                console.log(err);
            }
        }
        getData()
    }
}
parentEvents.addEventListener('click', fetchingData, false)

searchForm.addEventListener('submit', async(e) => {
    // Search functionallity 
    const urlSearchByName = `https://remotive.com/api/remote-jobs?limit=10&search=${searchValue.value}`
    console.log(searchValue.value);
    
    const response6 = await fetch(urlSearchByName)
    const data6 = await response6.json()
    let searchValue = document.getElementById('searchBar')
    jobsSection.innerHTML = ''
    e.preventDefault()
    showAllJobs(data6.jobs)
})

const showAllJobs = (jobsData) => {
    // Main function that builds most of the website
    showloading()
    jobsData.map(item => {
        jobsSection.append(buildCard(item))
    })
    hideLoading()
}

const buildCategories = (categories) => {
    //Function to build the categories and updates with the api
    categories.map(category => {
        const li = document.createElement('li')
        const a = document.createElement('a')
        setElement(a,'dropdown-item',category.name)
        li.append(a)
        dropDownMenu.append(li)
        a.addEventListener('click',async() => {
            urlCategory = `https://remotive.com/api/remote-jobs?limit=50&category=${category.slug}`
            const response5 = await fetch(urlCategory)
            const data5 = await response5.json()
            showAllJobs(data5.jobs)
        })
    })
    hideLoading()
    
}

const buildCard = (data,bool = false) => {
    //Creation of card elements
    const card = document.createElement('div')
    const cardBody = document.createElement('div')
    const salary = document.createElement('p')
    const jobDescription = document.createElement('div')
    const companyName = document.createElement('h5')
    const companyLogo = document.createElement('img')
    const jobTitle = document.createElement('h3')
    const jobType = document.createElement('p')
    const saveBtn = document.createElement('button')
    const seeMoreBtn = document.createElement('button')
    const divBtns = document.createElement('div')

    companyLogo.src = data.company_logo
    jobDescription.setAttribute('contenteditable','true')
    jobDescription.setAttribute('spellcheck','false')

    //Card assignments
    setElement(card,'card')
    setElement(cardBody,'card-body')
    setElement(
        jobDescription,
        'card-text lh-sm no-outline text-decoration-none text-muted infoJob',
        data.description,
    )
    setElement(salary,'card-text text-center',data.salary)
    setElement(companyName,'card-title fw-normal font-monospace',data.company_name)
    setElement(jobTitle,'card-title',data.title)
    setElement(jobType,'card-text text-center my-2','*' + data.job_type)
    setElement(saveBtn,'btn btn-outline-danger remove','Save This')
    setElement(seeMoreBtn,'btn btn-primary','See Full JOB')
    setElement(divBtns,'d-grid gap-2 col-6 mx-auto')

    //Function to handle btn events
    localStorageBtnEvents(saveBtn,seeMoreBtn,data,bool)
    
    divBtns.append(saveBtn,seeMoreBtn)
    cardBody.append(jobDescription,salary)
    card.append(companyName,companyLogo,jobTitle,cardBody,divBtns,jobType)
    return card
}

const setElement = (element,classStr,innerStr=element.innerHTML) => {
    //Function that sets classname and innerhtml to DOM element
    element.className = classStr
    element.innerHTML = innerStr 
}

const localStorageBtnEvents = (saveBtn, seeMoreBtn, data, bool) => {
    //bool indicates whether on savedJobs event
    saveBtn.addEventListener('click',() => {
        if(saveBtn.innerHTML === 'Save This'){
            if(!bool){
                localStorageSavedJobs.push([data])
                console.log(localStorageSavedJobs);
                localStorage.setItem('jobs',JSON.stringify(localStorageSavedJobs))
                setElement(saveBtn,'btn btn-outline-danger','Remove')
            }
        }else{
            if(bool){
                localStorageSavedJobs = localStorageSavedJobs.filter(([item]) => {
                    if(item.id !== data.id){
                        return item
                    }
                })
                localStorage.setItem('jobs',JSON.stringify(localStorageSavedJobs))
                setElement(saveBtn,'btn btn-danger','Remove')
                saveBtn.parentElement.parentElement.remove()
            }else{
                localStorageSavedJobs = localStorageSavedJobs.filter(([item]) => {
                    if(item.id !== data.id){
                        return item
                    }
                })
                setElement(saveBtn,'btn btn-outline-danger','Save This')
                localStorage.setItem('jobs',JSON.stringify(localStorageSavedJobs))
            }
        }
    })
    seeMoreBtn.addEventListener('click', () => {
        showloading()
        const iframe = document.createElement('iframe')
        iframe.src = data.url
        jobsSection.innerHTML = ''
        jobsSection.innerHTML +=`<h1>Remotive Website</h1>`
        jobsSection.append(iframe);
        hideLoading()

    })
    return saveBtn, seeMoreBtn
}

function showloading(){
    //Manipulation of loader while fetching data
    loader.style.display = 'flex'
    setTimeout(() => {
        loader.style.display = 'none'
    }, 3000)
}
function hideLoading(){
    loader.style.display = 'none'
}
const preloader = document.querySelector('.preloader')
const fadeOutEffect = setInterval(() => {
    if (!preloader.style.opacity) {
      preloader.style.opacity = 1;
    }
    if (preloader.style.opacity > 0) {
      preloader.style.opacity -= 0.30;
    } else {
      clearInterval(fadeOutEffect);
      preloader.style.display = 'none'
    }
  }, 300);