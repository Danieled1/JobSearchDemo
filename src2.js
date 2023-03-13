let urlSearchByName = 'https://remotive.com/api/remote-jobs?limit=50&search='
let urlSavedJobs = 'https://remotive.com/api/remote-jobs?&company_name='
let urlCategories = 'https://remotive.com/api/remote-jobs/categories'
let urlCategory = 'https://remotive.com/api/remote-jobs?limit=50&category='
let allJobs = 'https://remotive.com/api/remote-jobs?limit=50'

let localStorageSavedJobs = localStorage.getItem('jobs')
? JSON.parse(localStorage.getItem('jobs'))
: []

const parentEvents = document.querySelector('#parentEvents')
const mainArea = document.querySelector('#divArea')
const dropDownMenu = document.querySelector('.dropdown-menu')
const fetchingData = event => {
    if(event.target !== event.currentTarget){
        let eventName = event.target.innerHTML
        // console.log(eventName);
        const getData = async() => {
            mainArea.innerHTML = ''
            try{
                switch (eventName) {
                    case 'All Jobs':
                        const response = await fetch(allJobs)
                        const data = await response.json()
                        showAllJobs(data.jobs)
    
                    case 'Categories':
                        //Checks if the categories have been uploaded yet
                        if(dropDownMenu.childNodes.length === 1){
                            const response2 = await fetch(urlCategories)
                            const data2 = await response2.json()
                            buildCategories(data2.jobs)
                        }
                        return undefined
                    case 'Saved Jobs💝':
                        localStorageSavedJobs.forEach( async(item) => {
                            mainArea.append(buildCard(item[0],true))
                        })
                }       
            } catch (err){
                console.log(err);
            }
        }
        getData()
    }
    event.stopPropagation()
}
parentEvents.addEventListener('click', fetchingData, false)

const showAllJobs = (jobsData) => {
    jobsData.map(item => {
        mainArea.append(buildCard(item))
    })
}

const showSearchsByName = () => {
    //onkeyup 
}
const buildCategories = (categories) => {
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

    //Card assignments
    setElement(card,'card')
    setElement(cardBody,'card-body')
    setElement(jobDescription,'card-text fw-light infoJob lh-sm', data.description)
    setElement(salary,'card-text text-center',data.salary)
    setElement(companyName,'card-title',data.company_name)
    setElement(jobTitle,'card-title',data.title)
    setElement(jobType,'card-text text-center','*' + data.job_type)
    setElement(saveBtn,'btn btn-outline-danger','Save This')
    setElement(seeMoreBtn,'btn btn-success','See Full JOB')
    setElement(divBtns,'d-grid gap-2 col-6 mx-auto')

    //Function to handle btn events
    localStorageBtnEvents(saveBtn,seeMoreBtn,data,bool)
    
    divBtns.append(saveBtn,seeMoreBtn)
    cardBody.append(jobDescription,salary)
    card.append(companyName,companyLogo,jobTitle,cardBody,divBtns,jobType)
    return card
}

const setElement = (element,classStr,innerStr=element.innerHTML) => {
    element.className = classStr
    element.innerHTML = innerStr 
}

const localStorageBtnEvents = (saveBtn,seeMoreBtn, data,bool) => {
    saveBtn.addEventListener('click',() => {
        if(saveBtn.innerHTML === 'Save This'){
            localStorageSavedJobs.push([data])
            console.log(localStorageSavedJobs);
            localStorage.setItem('jobs',JSON.stringify(localStorageSavedJobs))
            setElement(saveBtn,'btn btn-danger','Remove')

        }else{
            if(bool){
                setElement(saveBtn,'btn btn-danger','Remove')
                localStorageSavedJobs = localStorageSavedJobs.filter(([item]) => {
                    if(item.id !== data.id){
                        return item
                    }
                })
                localStorage.setItem('jobs',JSON.stringify(localStorageSavedJobs))
                saveBtn.parentElement.parentElement.remove()
            }else{
                setElement(saveBtn,'btn btn-outline-danger','Save This')
                localStorageSavedJobs = localStorageSavedJobs.filter(([item]) => {
                    if(item.id !== data.id){
                        return item
                    }
                })
                localStorage.setItem('jobs',JSON.stringify(localStorageSavedJobs))
            }
        }
    })
    seeMoreBtn.addEventListener('click', () => {
        const iframe = document.createElement('iframe')
        iframe.src = data.url
        mainArea.innerHTML = ''
        mainArea.innerHTML +=`<h1>Remotive Website</h1>`
        mainArea.append(iframe);
    })
    return saveBtn, seeMoreBtn
}
