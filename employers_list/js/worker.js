export default class Worker {

  constructor(name, surname, lastname, workStart, birthDate, post) {
    this.name = name
    this.surname = surname
    this.lastname = lastname
    this.workStart = workStart
    this.birthDate = birthDate
    this.post = post
  }

  // Функция для получения ФИО сотрудника

  getFIO() {
    return this.surname + ' ' + this.name + ' ' + this.lastname;
  }

  // Функция для получения стажа работы

  getWorkPeriod() {
    const currentTime = new Date();
    return currentTime.getFullYear() - this.workStart;
  }

  // Функция для получения даты рождения

  getBirthDateString() {
    const yyyy = this.birthDate.getFullYear();
    let mm = this.birthDate.getMonth() + 1; // month start at 0!
    let dd = this.birthDate.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    return dd + '.' + mm + '.' + yyyy;
  }

  // Функция для получения возраста сотрудника

  getAge() {
    const today = new Date();
    let age = today.getFullYear() - this.birthDate.getFullYear();
    let m = today.getMonth() - this.birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < this.birthDate.getDate())) {
      age--;
    }
    return age;
  }
}







