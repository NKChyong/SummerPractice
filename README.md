## **Online Testing Platform**

### Description

This project is a web platform designed for creating and administering online tests. The system supports two main user roles: **Teacher** and **Student**.

  * A **Teacher** can create tests, add various question types, and share them with students via unique links.
  * A **Student** can take the tests assigned to them.
  * The system provides the teacher with **statistics** on test results, including the overall score and detailed answers to each question.

### Technologies

  * **Backend:** `NodeJS`, `Express`
  * **Frontend:** `ReactJS`, `Tailwind`, `axios`
  * **Database:** `MongoDB`
  * **Other:** `Docker`, `Swagger`

### Project Structure

```
.
├── server/
│   ├── config/               # DB configuration
│   ├── controllers/          # Core functionality
│   └── middlewares/          # Authentication layer
│   └── models/               # Data typing
│   └── routes/               # Backend endpoints
│   └── swagger/              # API documentation
├── src/
│   ├── api/                  # Axios setup
│   ├── assets/               # Static files
│   ├── components/           # Functional components
│   ├── pages/                # Pages
├──
```

___
___
___


## **Платформа для создания и прохождения тестирования**

### Описание

Данный проект представляет собой веб-платформу, предназначенную для создания и проведения онлайн-тестирования. Система поддерживает две основные роли: **Преподаватель** и **Студент**.

  * **Преподаватель** имеет возможность создавать тесты, добавлять вопросы различных типов и делиться ими со студентами с помощью уникальных ссылок.
  * **Студент** может проходить назначенные ему тесты.
  * Система предоставляет преподавателю **статистику** по результатам прохождения тестов, включая общий балл и ответы на каждый вопрос.

### Технологии

  * **Backend:** `NodeJS`, `Express`
  * **Frontend:** `ReactJS`, `TailWind`, `axios`
  * **База данных:** `MongoDB`
  * **Прочее:** `Docker`, `Swagger`

### Структура проекта

```
.
├── server/                 
│   ├── config/               # Конфиг БД
│   ├── controllers/          # Основной функционал
│   └── middlewares/          # Слой аутент-ии
│   └── models/               # Типизация
│   └── routes/               # Ручки бэкенда
│   └── swagger/              # Идентификация
├── src/         
│   ├── api/                  # Настройка axios
│   ├── assets/               # Статика
│   ├── components/           # Функциональные компоненты
│   ├── pages/                # Страницы
├── 
```
