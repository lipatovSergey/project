import Student from "./student.js";

// Массив сотрудников
const students = [
    new Student('Александр', 'Конев', 'Иванов', new Date(1990, 11, 5), '2023', 'Информатика'),
    new Student('Иван', 'Прошкин', 'Сергеевич',new Date(1992, 2, 10), '2020', 'Экономика'),
    new Student('Алексей', 'Фрукт', 'Антонович',new Date(1994, 6, 20), '2018', 'Программирование')
]

const $studentsList = document.getElementById('studentsList');
const $studentsListThAll = document.querySelectorAll('.studentsTable th');

let column = 'fio';
let columnDir = false;

// Получить TR(строку) студента
function newStudentTr(student) {
    const $studentTr = document.createElement('tr'),
          $fioTd = document.createElement('td'),
          $birthDateTd = document.createElement('td'),
          $studyingStartTd = document.createElement('td'),
          $facultyTd = document.createElement('td')
    
    $fioTd.textContent = student.fio;
    $birthDateTd.textContent = student.getBirthDateString() + '(' + student.getAge() + 'лет)';
    $studyingStartTd.textContent = student.getStudyTime();
    $facultyTd.textContent = student.faculty;

    $studentTr.append($fioTd);
    $studentTr.append($birthDateTd);
    $studentTr.append($studyingStartTd);
    $studentTr.append($facultyTd);

    return $studentTr;
}

// Функцмя сортировки 
function getSortStudents(prop, dir) {
    return [...students].sort(function(studentA, studentB) {
        if (dir) {
            if (studentA[prop] > studentB[prop]) {
                return 1;
            } else {
                return -1;
            }
        } else {
            if (studentA[prop] < studentB[prop]) {
                return 1;
            } else {
                return -1;
            }
        }
    })
        
};

// Отрисовать
function render() {
    let sortedStudents = getSortStudents(column, columnDir);
    $studentsList.innerHTML = '';
    for (const student of sortedStudents) {
        $studentsList.append(newStudentTr(student));
    }
}

// Событие сортировки
$studentsListThAll.forEach(element => {
    element.style.cursor = 'pointer';
    element.addEventListener('click', function () {
        column = this.dataset.column;
        columnDir = !columnDir;
        render()
    })
})


// Добавление в список
function validateForm() {

    let valid = true;
    const $start = document.getElementById('input-studyingStart');

    const requiredFields = ['input-name', 'input-surname', 'input-lastname', 'input-birtDate', 'input-studyingStart', 'input-faculty'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = document.getElementById(requiredFields[i]);
        let element = field.value;
        let value = typeof element === 'string' ? element.trim() : element;

        if (value === '') {
            alert(`Поле "${field.getAttribute('placeholder')}" обязательно для заполнения.`);
            field.classList.add('error');
            valid = false;
            break
        }
    
    if ($start.value < 2000) {
        alert('год начала обучения находится в диапазоне от 2000-го до текущего года.');
        valid = false;
        break
    }
        
}
return valid;
}

document.getElementById('add-student').addEventListener('submit', function(event) {
    event.preventDefault();

    const valid = validateForm();

    if (valid) {

    students.push(new Student(
        document.getElementById('input-name').value,
        document.getElementById('input-lastname').value,
        document.getElementById('input-surname').value,
        new Date(document.getElementById('input-birtDate').value),
        Number(document.getElementById('input-studyingStart').value),
        document.getElementById('input-faculty').value
    ));

    render(); // Обновляем отображение списка студентов
}
});


render();
      



