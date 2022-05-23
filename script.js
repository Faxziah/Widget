define(['jquery'], function ($) {
  var CustomWidget = function () {
    var self = this,
    system = self.system(),
    langs = self.langs;

    this.callbacks = {
      settings: function () { // Метод вызывается при щелчке на иконку виджета в настройках

        const limit = 25;
        const getContactsListQueryUrl = '/api/v4/contacts';
        let page = 1;

        const text = "Контакт без сделок";
        const task_type_id = 1;
        const entity_type = "contacts";
        const addNewTask = '/api/v4/tasks';
        let complete_till = new Date () // Добавить к выполнению задачи 1 час
        complete_till.setHours(complete_till.getHours() + 1);
        complete_till = Math.floor (complete_till.getTime() / 1000);
        let contacts_without_leads = 0

        function getContacts() { // Метод получения контактов
          $.ajax({
            url: getContactsListQueryUrl,
            method: 'GET',
            data: {
              limit: limit,
              with: 'leads',
              page: page 
            }
          }).done(function(data) {
            if (data) {
              console.log ('Контакты получены')
              
              for (let i = 0; i < data._embedded.contacts.length; i++) {
                if (data._embedded.contacts[i]._embedded.leads.length == 0) { // При отсутствии сделок у контакта
                  contacts_without_leads++;
                  let entity_id = data._embedded.contacts[i].id; // id контакта для добавления задачи
                  function addTask() { // Метод добавления задачи
                    $.ajax({
                      url: '/api/v4/tasks',
                      method: 'POST',
                      data: JSON.stringify ([{
                        task_type_id: task_type_id,
                        text: text,
                        complete_till: complete_till,
                        entity_id: entity_id,
                        entity_type: entity_type
                      }])
                    }).done(function(data) {
                      console.log (data)
                    }).fail(function() {
                      console.log ('Ошибка. Задачи не добавлены.');
                    })
                  }
                  addTask();
                }
              }
              if (contacts_without_leads == 0) {
                console.log ('Задачи не добавлены. Контактов без сделок нет.');
              }
              else if (contacts_without_leads > 0) {
                console.log ('Задачи добавлены')
              }
            } 
            else {
              console.log ('Контакты не получены. Контактов нет.');
              return false;
            }
          }).fail(function() {
            console.log ('Ошибка. Контакты не получены.');
            return false;
          })
          page++;
        }
        getContacts();
        return true;
      },
      init: function () {
        return true;
      },
      bind_actions: function () {
        return true;
      },
      render: function () {
        return true;
      },
      dpSettings: function () {},
      advancedSettings: function () {},
      destroy: function () {},
      contacts: {
        selected: function () {}
      },
      onSalesbotDesignerSave: function (handler_code, params) {}, 
      leads: {
        selected: function () {}
      },
      todo: { 
        selected: function () {}
      },                      
      onSave: function () {return true;},
      onAddAsSource: function (pipeline_id) {}
    };
    return this;
  };
  return CustomWidget;
});