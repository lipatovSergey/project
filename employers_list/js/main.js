import Worker from "./worker.js";

const workers = [
  new Worker('Игорь', 'Фролов', 'Сергеевич', 2011, new Date(1992, 2, 21), 'Строитель'),
  new Worker('Алёна', 'Белых', 'Юрьевна', 2021, new Date(1998, 4, 11), 'Юрист'),
  new Worker('Иван', 'Иванов', 'Иваныч', 2011, new Date(1987, 1, 23), 'Рабочий')
]

// ghb

const $workersList = document.getElementById("workersList");

function newWorkerTR(worker) {
  const $workerTR = document.createElement('tr'),
        $fioTD = document.createElement('td'),
        $birtDateTD = document.createElement('td'),
        $workStartTD = document.createElement('td'),
        $postTD = document.createElement('td')

  $fioTD.textContent = worker.getFIO();
  $birtDateTD.textContent = worker.getBirthDateString() + '(' + worker.getAge() + ' лет)';
  $workStartTD.textContent = worker.workStart + ' (' + worker.getAge() + ' лет)';
  $postTD.textContent = worker.post;

  $workerTR.append($fioTD)
  $workerTR.append($birtDateTD)
  $workerTR.append($workStartTD)
  $workerTR.append($postTD)

  return $workerTR;
}

function render() {
  const workersCopy = [...workers]

   for (const worker of workersCopy) {
      $workersList.append(newWorkerTR(worker))
   }
}

render()
