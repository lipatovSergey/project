export default class Student {

    constructor(name, surName, lastName, birthDate, studyingStart, faculty) {
        this.name = name;
        this.surName = surName;
        this.lastName = lastName;
        this.birthDate = birthDate;
        this.studyingStart = studyingStart;
        this.faculty = faculty;
    }

    // Функция для получения ФИО
    get fio() {
        return this.surName + ' ' + this.name + ' ' + this.lastName;
    }

    // Функция для получения даты рождения
    getBirthDateString() {
        let yyyy = this.birthDate.getFullYear();
        let mm = this.birthDate.getMonth() + 1; // month start at 0!
        let dd = this.birthDate.getDate();

        if (mm < 10) mm = 0 + mm;
        if (dd < 10) dd = 0 + dd;
    }

    // Функция для получения возраста 
    getAge() {
        const today = new Date;
        let age = today.getFullYear() - this.birthDate.getFullYear();
        let month = today.getMonth() - this.birthDate.getMonth();
        if (month < 0 || (m === 0 && today.getDate() < this.birthDate.getDate())) {
            age--;
        }
        return age;
    }

    // Функция для получения срока учёбы
    getstudyTime() {
        const currentYear = new Date.getFullYear();
        const currentMonth = new Date.getMonth() + 1; // month start at 0!
        let graduationYear = this.studyingStart + 4;
        
        if (currentYear > graduationYear || currentYear === graduationYear && currentMonth > 8 || currentYear - this.studyingStart > 4) {
            return `${this.studyingStart} - ${graduationYear}`
        }
    }

}