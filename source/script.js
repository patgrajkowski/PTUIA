const {Builder, By, Key, until} = require('selenium-webdriver');
const fs = require('fs');
// Zczytuję plik json
let personsJSON = fs.readFileSync('./tests.json');
let persons = JSON.parse(personsJSON);
let results = [];
// funkcja przechodząca przez wszystkie obiekty w tests.json i wykonująca na nich callback function w postaci test()
runTests = async () => {
    for (let i = 0; i < persons.length; i++) {
        results.push(`Test ${i+1}: ${await test(persons[i])}`);
    }
    await console.log(results);
};
runTests();
// główna funkcja, za parametr przyjmuje obiekt person, obiekty person przechowuję w osobnym pliku tests.json
async function test(person) {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        // przypisanie destrukturyzujące, odczytuje wartości pól z obiektu person
        const { firstName, lastName, age, doctor, parents } = person;
        await driver.get('https://lamp.ii.us.edu.pl/~mtdyd/zawody/');
        await driver.findElement(By.id('inputEmail3')).sendKeys(firstName);
        await driver.findElement(By.id('inputPassword3')).sendKeys(lastName);
        await driver.findElement(By.id('dataU')).sendKeys(age);
        if(parents === true){
            await driver.findElement(By.id('rodzice')).click();
        }
        if(doctor === true){
            await driver.findElement(By.id('lekarz')).click();
        }
        await driver.findElement(By.className('btn-default')).click();
        await driver.wait(until.alertIsPresent());
        let alert = await driver.switchTo().alert();
        await alert.accept();
        alert = await driver.switchTo().alert();
        await alert.accept();
        const testResult = await driver.findElement(By.id('returnSt')).getText();
        // funkcja zwraca do jakiej grupy został udało się zakwalifikować testowanemu obiektowi
        return testResult;
    }
    finally{
        // po każdym przejściu funkcja zamyka okno przeglądarki
        driver.close()
    }
};