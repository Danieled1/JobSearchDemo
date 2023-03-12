// URLS
const url = 'https://remotive.com/api/remote-jobs?limit=5&category=&search=&company_name='

//CONSTENTS
const mainArea = document.querySelector('#divArea')
mainArea.innerHTML = `        
    <h1>Welcome to our jobs search service.</h1>
    <p>To use our service all wjat you need is a good heart, and a little mind 🤠</p>
    <br><hr><br>
    <h3>Enjoy</h3>
`
console.log(mainArea);


const getData = async() => {
    try{

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

const showDropdowns = () => {

}

const buildJobCards = (objJobs) => {
    objJobs.map(item => {
        const card = document.createElement('div')
        const companyName = document.createElement('p')
        const companyLogo = document.createElement('img')
        const jobDescription = document.createElement('iframe')
        const salary = document.createElement('p')
        
        //Bootstrap classes design method

    })
    
}