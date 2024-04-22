import Worker from "./worker.js";

// Массив сотрудников
const workers = [
  new Worker('Игорь', 'Фролов', 'Сергеевич', 2011, new Date(1992, 2, 21), 'Строитель'),
  new Worker('Алёна', 'Белых', 'Юрьевна', 2021, new Date(1998, 4, 11), 'Юрист'),
  new Worker('Иван', 'Иванов', 'Иваныч', 2001, new Date(1987, 1, 23), 'Рабочий')
]

const $workersList = document.getElementById("workersList"),
      $workersListTHAll = document.querySelectorAll('.workersTable th');

let column = 'fio',
    columnDir = true; 

// Получить TR сотрудника
function newWorkerTR(worker) {
  const $workerTR = document.createElement('tr'),
        $fioTD = document.createElement('td'),
        $birtDateTD = document.createElement('td'),
        $workStartTD = document.createElement('td'),
        $postTD = document.createElement('td')

  $fioTD.textContent = worker.fio;
  $birtDateTD.textContent = worker.getBirthDateString() + '(' + worker.getAge() + ' лет)';
  $workStartTD.textContent = worker.workStart + ' (' + worker.getWorkPeriod() + ' лет)';
  $postTD.textContent = worker.post;

  $workerTR.append($fioTD)
  $workerTR.append($birtDateTD)
  $workerTR.append($workStartTD)
  $workerTR.append($postTD)

  return $workerTR;
}

// Получить сортировку массива по параметрам
const getSortWorkers = (prop, dir) => {
  return [...workers].sort((workerA, workerB) => (dir ? workerA[prop] > workerB[prop] : workerA[prop] < workerB[prop]) ? 1 : -1);
};

// Отрисовать
function render() {
   let workersCopy = [...workers];

   workersCopy = getSortWorkers(column, columnDir);

   $workersList.innerHTML = '';

   for (const worker of workersCopy) {
      $workersList.append(newWorkerTR(worker))
   }
}
// События сортировки
$workersListTHAll.forEach(element => {
  element.addEventListener('click', function() {
    column = this.dataset.column;
    columnDir = !columnDir
    render()
  })
})

// Добавление
document.getElementById('add-worker').addEventListener('submit', function(event) {
  event.preventDefault();

  workers.push(new Worker(
    document.getElementById('input-name').value,
    document.getElementById('input-surname').value,
    document.getElementById('input-lastname').value,
    Number(document.getElementById('input-workStart').value),
    new Date(document.getElementById('input-birtDate').value),
    document.getElementById('input-post').value
  ))

  render();

})

render()
