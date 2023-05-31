"use strict"

//  DRIVER CODE
main()

function main() {
    const listKey = "todos-list"
    let list = []

    getFromStorage(listKey, list)
    setClearEvent(listKey, list)
    setAddEvent(listKey, list)
    setDate()
}

//  HELPER FUNCTIONS
function getFromStorage(listKey, list) {
    let storedListString = localStorage.getItem(listKey)
    let storedList = storedListString == null ? null : JSON.parse(storedListString)

    if (storedList != null) {
        storedList.forEach(todo => {
            addTodo(listKey, list, todo.text, todo.strike)
        })
    }
}

function addTodo(listKey, list, todoText, todoStrike) {
    let newListElement = {
        text: todoText,
        strike: todoStrike
    }

    list.push(newListElement)
    let documentList = document.getElementById("todos")
    let liElement = document.createElement("li")

    liElement.innerHTML = todoText
    if (todoStrike) {
        liElement.className = "strike"
    } else {
        liElement.className = "unstrike"
    }
    liElement.onclick = function () {
        let index = getIndexOf(liElement)
        let listElement = list[index]

        if (listElement.strike) {
            listElement.strike = false
            documentList.children[index].className = "unstrike"
        } else {
            listElement.strike = true
            documentList.children[index].className = "strike"
        }
        setToStorage(listKey, list)
    }

    liElement.ondblclick = function () {
        removeAtIndex(listKey, list, getIndexOf(liElement))
        setToStorage(listKey, list)
    }

    documentList.appendChild(liElement)
    setToStorage(listKey, list)
}

function getIndexOf(liElement) {
    let documentList = document.getElementById("todos")
    let children = documentList.children

    for (let length = children.length, i = 0; i < length; i++) {
        if (children[i] == liElement) {
            return i
        }
    }
    return -1
}

function setToStorage(listKey, list) {
    let storedListString = JSON.stringify(list)

    localStorage.setItem(listKey, storedListString)
}

function removeAtIndex(listKey, list, index) {
    let documentList = document.getElementById("todos")
    let children = documentList.children
    let length = children.length

    if (index < 0 || index >= length) {
        return
    }

    list.splice(index, 1)
    documentList.removeChild(children[index])
    setToStorage(listKey, list)
}

function setClearEvent(listKey, list) {
    let clearButton = document.getElementById("clear-button")

    clearButton.onclick = function () {
        list = []
        let documentList = document.getElementById("todos")

        empty(listKey, list, documentList)
    }
}

function empty(listKey, list, documentList) {
    while (documentList.firstChild) {
        documentList.removeChild(documentList.firstChild)
    }
    setToStorage(listKey, list)
}

function setAddEvent(listKey, list) {
    let addButton = document.getElementById("add-button")

    addButton.onclick = function () {
        addTodoText(listKey, list)
    }

    window.onkeyup = function (event) {
        if (event.key == "Enter") {
            addTodoText(listKey, list)
        }
    }
}

function addTodoText(listKey, list) {
    let todoText = getText()

    if (todoText != "") {
        addTodo(listKey, list, todoText, false)
    }
}

function getText() {
    let textBox = document.getElementById("add-text")
    let result = textBox.value

    textBox.value = ""
    return result
}

function setDate() {
    let today = new Date()
    document.getElementById("date").textContent = today.toLocaleString(
        "en-US",
        { day: "numeric", month: "long", year: "numeric" }
    )
}