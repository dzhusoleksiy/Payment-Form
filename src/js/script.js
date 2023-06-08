const expirationSelect = document.querySelector("[data-expiration-year]")
const nameInput = document.getElementById("name")
const cardForm = document.getElementById("credit-card")
const rotateButton = document.getElementById("rotate-button")

const currentYear = new Date().getFullYear()
for (let i = currentYear; i < currentYear + 8; i++) {
  const option = document.createElement("option")
  option.value = i
  option.innerText = i
  expirationSelect.append(option)
}

document.addEventListener("keydown", e => {
  const input = e.target
  const key = e.key
  if (!isConnectedInput(input)) return

  switch (key) {
    case "ArrowLeft": {
      if (input.selectionStart === 0 && input.selectionEnd === 0) {
        const prev = input.previousElementSibling
        if (!prev) return
        prev.focus()
        prev.selectionStart = prev.value.length - 1
        prev.selectionEnd = prev.value.length - 1
        e.preventDefault()
      }
      break
    }
    case "ArrowRight": {
      const nex = input.nextElementSibling
      if (!nex) return
      if (
        input.selectionStart === input.value.length &&
        input.selectionEnd === input.value.length
      ) {
        const next = input.nextElementSibling
        next.focus()
        next.selectionStart = 1
        next.selectionEnd = 1
        e.preventDefault()
      }
      break
    }
    case "Delete": {
      if (
        input.selectionStart === input.value.length &&
        input.selectionEnd === input.value.length
      ) {
        const next = input.nextElementSibling
        next.value = next.value.substring(1, next.value.length)
        next.focus()
        next.selectionStart = 0
        next.selectionEnd = 0
        e.preventDefault()
      }
      break
    }
    case "Backspace": {
      if (input.selectionStart === 0 && input.selectionEnd === 0) {
        const prev = input.previousElementSibling
        if (!prev) return
        prev.value = prev.value.substring(0, prev.value.length - 1)
        prev.focus()
        prev.selectionStart = prev.value.length
        prev.selectionEnd = prev.value.length
        e.preventDefault()
      }
      break
    }
    default: {
      if (e.ctrlKey || e.altKey) return
      if (key.length > 1) return
      if (key.match(/^[^0-9]$/)) return e.preventDefault()

      e.preventDefault()
      onInputChange(input, key)
    }
  }
})

document.addEventListener("paste", e => {
  const input = e.target
  const data = e.clipboardData.getData("text")

  if (!isConnectedInput(input)) return
  if (!data.match(/^[0-9]+$/)) return e.preventDefault()

  e.preventDefault()
  onInputChange(input, data)
})

function onInputChange(input, newValue) {
  const start = input.selectionStart
  const end = input.selectionEnd
  updateInputValue(input, newValue, start, end)
  focusInput(input, newValue.length + start)
  const firstFour = input
    .closest("[data-connected-inputs]")
    .querySelector("input").value

  if (firstFour.startsWith("4")) {
    document.getElementById("card-logo").src = "i/svg/visa.svg"
  } else if (firstFour.startsWith("5")) {
    document.getElementById("card-logo").src = "i/svg/mastercard.svg"
  }
}

function updateInputValue(input, extraValue, start = 0, end = 0) {
  const newValue = `${input.value.substring(
    0,
    start
  )}${extraValue}${input.value.substring(end, 4)}`
  input.value = newValue.substring(0, 4)
  if (newValue > 4) {
    const next = input.nextElementSibling
    if (next == null) return
    updateInputValue(next, newValue.substring(4))
  }
}

function focusInput(input, dataLength) {
  let addedChars = dataLength
  let currentInput = input
  while (addedChars > 4 && currentInput.nextElementSibling != null) {
    addedChars -= 4
    currentInput = currentInput.nextElementSibling
  }
  if (addedChars > 4) addedChars = 4

  currentInput.focus()
  currentInput.selectionStart = addedChars
  currentInput.selectionEnd = addedChars
}

function isConnectedInput(input) {
  const parent = input.closest("[data-connected-inputs]")
  return input.matches("input") && parent != null
}

addEventListener("load", () => {
  document.getElementById("first-of-con").focus();
});

document.getElementById("cvc").addEventListener("keydown", e => {
  const key = e.key
  if (e.ctrlKey || e.altKey) return
  if (key.length > 1) return
  if (key.match(/^[^0-9]$/)) return e.preventDefault()
})

nameInput.addEventListener("keydown", e => {
  const key = e.key

  switch (key) {
    case "Tab": {
      sideRotation();
    }
  }
})

function sideRotation() {
  if (!cardForm.style.transform || cardForm.style.transform == "rotateY(0deg)") {
    cardForm.style.transform = "rotateY(-180deg)";
    rotateButton.style.transform = "rotate(-180deg)";
  }
  else {
    cardForm.style.transform = "rotateY(0deg)";
    rotateButton.style.transform = "rotate(0)";
  } 
}
rotateButton.onclick = sideRotation;

function toRequired() {
  const cardInputs = Array.from(document.querySelector("#connected-inputs").querySelectorAll("input"))
  if ((cardInputs.every(input => input.value.length == 4)) && nameInput.value.length) {
    if(document.getElementById("cvc").value.length !== 3) {
      cardForm.style.transform = "rotateY(-180deg)";
      rotateButton.style.transform = "rotate(-180deg)";
    }
  } else {
    cardForm.style.transform = "rotateY(0deg)";
    rotateButton.style.transform = "rotate(0)";
  }
}
document.getElementById("submit-button").onclick = toRequired;