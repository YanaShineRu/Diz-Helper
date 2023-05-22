// Создание графического интерфейса
var dialog = new Window("dialog", "Diz Helper 0.0.1 by YanaShine");

dialog.add("statictext", undefined, "Введите имя дизайнера:");
var authorInput = dialog.add("edittext", undefined, "");
authorInput.textAlign = "center";
authorInput.characters = 20;
authorInput.size = [200, 20];

dialog.add("statictext", undefined, "Введите номер сборки:");
var buildNumberInput = dialog.add("edittext", undefined, "");
buildNumberInput.characters = 20;
buildNumberInput.size = [200, 20];

// Создание панели
var panel = dialog.add("panel", undefined, "Заменяемые аргументы в макете");

panel.spacing = 2;
panel.margins.top = 20;
panel.margins.bottom = 20;

// Добавление описания аргументов замены
panel.add("statictext", undefined, "Имя дизайнера: BDesigner");
panel.add("statictext", undefined, "Номер сборки: BNumber");
panel.add("statictext", undefined, "Текущая дата: BDate");

var buttonGroup = dialog.add("group");
var cancelButton = buttonGroup.add("button", undefined, "Отмена");
var okButton = buttonGroup.add("button", undefined, "OK");

// Обработка событий нажатия на кнопки
cancelButton.onClick = function() {
dialog.close();
};

okButton.onClick = function() {
  // Получение значений из текстовых полей
  var author = authorInput.text;
  var buildNumber = buildNumberInput.text;

// Получение текущей даты в формате ДД-ММ-ГГГГ
  var currentDate = new Date();
  var day = currentDate.getDate();
  var month = currentDate.getMonth() + 1; // добавляем 1, так как отсчет месяцев начинается с 0
  var year = currentDate.getFullYear();

  // Форматирование дат с ведущим нулем
  var formattedDate = ("0" + day.toString()).slice(-2) + "." + ("0" + month.toString()).slice(-2) + "." + year;
 
  // Вызов функции для замены текста в макете
  var isSuccess = updateIllustratorDocument(author, buildNumber, formattedDate);

  // Закрытие диалогового окна
  dialog.close();

  // Вывод сообщения об успешной замене значений в макете
  if (isSuccess) {
    var successMessage = "Значения в макете успешно заменены:\nИмя дизайнера: " + author + "\nНомер сборки: " + buildNumber + "\nДата: " + formattedDate;
    alert(successMessage);
  } else {
    alert("Не удалось заменить значения в макете.");
  }
};

// Отображение диалогового окна
dialog.show();

// Функция для замены текста в макете
function updateIllustratorDocument(author, buildNumber, formattedDate) {
  // Поиск текстовых объектов и замена текста
  try {
    var doc = app.activeDocument;

    var items = doc.pageItems;

    for (var i = 0; i < items.length; i++) {
      var item = items[i];

      if (item.name == "BDesigner") {
        item.textFrames[0].contents = author;
      }

      if (item.name == "BNumber") {
        item.textFrames[0].contents = buildNumber;
      }

      if (item.name == "BDate") {
        item.textFrames[0].contents = formattedDate;
      }
    }

    return true;
  } catch (e) {
    return false;
  }
}