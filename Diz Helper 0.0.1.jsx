// Создание графического интерфейса
var dialog = new Window("dialog", "GammaDiz Helper 0.0.1 by YanaShine");

// Добавление статического текста и полей ввода для имени дизайнера
dialog.add("statictext", undefined, "Введите имя дизайнера:");
var authorInput = dialog.add("edittext", undefined, "");
authorInput.textAlign = "center";
authorInput.characters = 20;
authorInput.size = [200, 20];

// Добавление статического текста и полей ввода для номера сборки
dialog.add("statictext", undefined, "Введите номер сборки:");
var buildNumberInput = dialog.add("edittext", undefined, "");
buildNumberInput.characters = 20;
buildNumberInput.size = [200, 20];

// Создание панели для описания аргументов замены
var panel = dialog.add("panel", undefined, "Заменяемые аргументы в макете");
panel.spacing = 2;
panel.margins.top = 20;
panel.margins.bottom = 20;

// Добавление описания аргументов замены в панель
panel.add("statictext", undefined, "Имя дизайнера: BDesigner");
panel.add("statictext", undefined, "Номер сборки: BNumber");
panel.add("statictext", undefined, "Текущая дата: BDate");

// Создание группы для кнопок "Отмена" и "OK"
var buttonGroup = dialog.add("group");
var cancelButton = buttonGroup.add("button", undefined, "Отмена");
var okButton = buttonGroup.add("button", undefined, "OK");

// Обработка события нажатия на кнопку "Отмена"
cancelButton.onClick = function() {
  dialog.close();
};

// Обработка события нажатия на кнопку "OK"
okButton.onClick = function() {
  // Получение значений из текстовых полей
  var author = authorInput.text;
  var buildNumber = buildNumberInput.text;

  // Получение текущей даты в формате ДД-ММ-ГГГГ
  var currentDate = new Date();
  var day = currentDate.getDate();
  var month = currentDate.getMonth() + 1;
  var year = currentDate.getFullYear();
  var formattedDate = ("0" + day.toString()).slice(-2) + "." + ("0" + month.toString()).slice(-2) + "." + year;

  // Получение активного документа в Adobe Illustrator
  var doc = app.activeDocument;

  // Вызов функции для замены текста в макете
  var isSuccess = updateIllustratorDocument(doc, author, buildNumber, formattedDate);

  // Закрытие диалогового окна
  dialog.close();
};

// Отображение диалогового окна
dialog.show();

// Функция для замены текста в макете
function updateIllustratorDocument(doc, author, buildNumber, formattedDate) {
  try {
    var items = doc.pageItems;

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      replaceTextInItem(item, author, buildNumber, formattedDate);
    }

    return true;
  } catch (e) {
    return false;
  }
}

// Рекурсивная функция для замены текста в элементе
function replaceTextInItem(item, author, buildNumber, formattedDate) {
  if (item.typename === "GroupItem") {
    // Если элемент является группой, рекурсивно вызываем функцию для каждого элемента внутри группы
    for (var i = 0; i < item.pageItems.length; i++) {
      replaceTextInItem(item.pageItems[i], author, buildNumber, formattedDate);
    }
  } else if (item.typename === "TextFrame") {
    // Если элемент является текстовым объектом, заменяем содержимое соответствующего аргумента, если оно совпадает с искомым
    if (item.contents === "BDesigner") {
      item.contents = author;
    } else if (item.contents === "BNumber") {
      item.contents = buildNumber;
    } else if (item.contents === "BDate") {
      item.contents = formattedDate;
    }
  }
}
