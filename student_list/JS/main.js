import Student from "./student.js";

// Объявление переменных
const MIN_STUDYING_START = 2000;
const MIN_BIRTHDATE = new Date(1900, 1, 1);
const $errors = document.getElementById('errors');



// Массив студентов
const students = [
    new Student('Александр', 'Конев', 'Иванов', new Date(1990, 11, 5), '2023', 'Информатика'),
    new Student('Иван', 'Прошкин', 'Сергеевич',new Date(1992, 2, 10), '2020', 'Экономика'),
    new Student('Алексей', 'Фрукт', 'Антонович',new Date(1994, 6, 20), '2018', 'Программирование')
]

const notFiltredStudentsArr = students;
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
    const studentsCopy = [...students];
    const sortedStudents = studentsCopy.sort(function(studentA, studentB) {
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
    return sortedStudents;
};

// Отрисовать
function render(studentsToRender) {
    const fragment = document.createDocumentFragment(); // Создаём новый фрагмент
    
    for (const student of studentsToRender) {
        if (student.isVisible) {
            fragment.appendChild(newStudentTr(student));
        }
    }

    $studentsList.innerHTML = '';
    $studentsList.append(fragment); // добавляем фрагмент сразу в контейнер списка
}

// Событие сортировки
$studentsListThAll.forEach(element => {
    element.style.cursor = 'pointer';
    element.addEventListener('click', function () {
        column = this.dataset.column;
        columnDir = !columnDir;
        const sortedStudents = getSortStudents(column, columnDir);
        render(sortedStudents)
    })
})


// Добавление в список
function validateForm() {

    let valid = true;
    
    const $start = document.getElementById('input-studyingStart');
    const $birtDate = document.getElementById('input-birthDate');


    const requiredFields = ['input-name', 'input-surname', 'input-lastname', 'input-birthDate', 'input-studyingStart', 'input-faculty'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = document.getElementById(requiredFields[i]);
        let element = field.value;
        let value = typeof element === 'string' ? element.trim() : element;

        if (value === '') {
            const errorField = document.createElement('p');
            errorField.textContent = `Поле "${field.getAttribute('placeholder')}" обязательно для заполнения.`;
            $errors.appendChild(errorField);
            valid = false;    
        } 
    }
    // проверка даты начала учёбы на валидность
    if ($start.value < MIN_STUDYING_START && $start.value !== '') {
        const errorStudyStart = document.createElement('p');
        errorStudyStart.textContent = 'Год начала обучения находится в диапазоне от 2000-го до текущего года.';
        $errors.appendChild(errorStudyStart);
        valid = false;
    }

    // проверка даты рождения на валидность
    const $birtDateValue = new Date($birtDate.value);
    if ($birtDateValue <  MIN_BIRTHDATE) {
        const errorBirthDay = document.createElement('p');
        errorBirthDay.textContent = 'Дата рождения должна быть не раньше 01.01.1900 года.';
        $errors.appendChild(errorBirthDay);
        valid = false;
        
    }
return valid;
}


// Функция поиска
function getStudentsFiltred() {
    
    const studentsCopy = [...students];

    const searchFio = document.getElementById('filter-fio').value.trim().toLowerCase();
    const searchFaculty = document.getElementById('filter-faculty').value.trim().toLowerCase();
    const searchStudyingStart = document.getElementById('filter-study_start').value;
    const searchStudyingEnd = document.getElementById('filter-study_end').value;
    
    for (const student of studentsCopy) {
        const graduationYear = parseInt(student.studyingStart) + 4;
        
        const nameMatch = searchFio !== '' && student.fio.toLowerCase().includes(searchFio);
        const facultyMatch = searchFaculty !== '' && student.faculty.toLowerCase().includes(searchFaculty);
        const studyStartMatch = parseInt(student.studyingStart) === parseInt(searchStudyingStart) ? true : false;
        const studyEndMatch = graduationYear === parseInt(searchStudyingEnd) ? true : false;
        
        
        if (!nameMatch && !facultyMatch && !studyStartMatch && !studyEndMatch) {
            student.isVisible = false;
        }
    }
    return(studentsCopy);
}

// Обработчик добавления студента
document.getElementById('add-student').addEventListener('submit', function(event) {
    event.preventDefault();

    $errors.innerHTML = '';
    const valid = validateForm();

    if (valid) {
    students.push(new Student(
        document.getElementById('input-name').value,
        document.getElementById('input-lastname').value,
        document.getElementById('input-surname').value,
        new Date(document.getElementById('input-birthDate').value),
        Number(document.getElementById('input-studyingStart').value),
        document.getElementById('input-faculty').value
    ));

    document.getElementById('input-name').value = '';
    document.getElementById('input-lastname').value = '';
    document.getElementById('input-surname').value = '';
    document.getElementById('input-birthDate').value = '';
    document.getElementById('input-studyingStart').value = '';
    document.getElementById('input-faculty').value = '';

    render(students); // Обновляем отображение списка студентов
}
});

// Обработчик поиска
document.getElementById('search').addEventListener('submit', function(evt) {
    evt.preventDefault();

    
    const notFiltredStudentsArr = [...students];
    const filtredStudents = getStudentsFiltred();

    document.getElementById('filter-fio').value = '';
    document.getElementById('filter-faculty').value = '';
    document.getElementById('filter-study_start').value = '';
    document.getElementById('filter-study_end').value = '';
    
    render(filtredStudents);
    return(notFiltredStudentsArr);
})

document.getElementById('filter-cancel').addEventListener('click', function() {
    render(notFiltredStudentsArr)
})

render(students)

console.log(notFiltredStudentsArr)





      



