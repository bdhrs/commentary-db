let c = console.log

import db from './commdef.json' assert {type: 'json'}

// elements

const dbLength = Object.keys(db).length
const subTitle = document.getElementById("subtitle")
const searchBox1 = document.getElementById("search-box1")
const searchBox2 = document.getElementById("search-box2")
const containsButton = document.getElementById("contains-button")
const startsWithButton = document.getElementById("starts-with-button")
const fuzzyButton = document.getElementById("fuzzy-button")
const endsWithButton = document.getElementById("ends-with-button")
const clearButton = document.getElementById("clear-button")
const searchMessage = document.getElementById("message")
const searchResults = document.getElementById("search-results")
const footerText = document.getElementById("footer")
let htmlCompiler = ""
let regexChar = RegExp("[^A-Za-zāīūṅñṇṃṭḍḷ ]")

subTitle.innerHTML = `Search <b>${dbLength}</b> bold defined terms in Vinaya, late Khuddaka Nikāya, Aṭṭhakathā, Ṭīkā and Aññā`

// listeners

searchBox1.addEventListener("keypress", function (event) {
	if (event.key === "Enter") {
		getValues("contains")
	}
})
searchBox2.addEventListener("keypress", function (event) {
	if (event.key === "Enter") {
		getValues("contains")
	}
})

// button clicks

containsButton.addEventListener("click", function() {
	getValues("search")
})
startsWithButton.addEventListener("click", function () {
	getValues("startswith")
})
fuzzyButton.addEventListener("click", function () {
	getValues("fuzzy")
})
endsWithButton.addEventListener("click", function () {
	getValues("endswith")
})
clearButton.addEventListener("click", clearValues)

// contextual help listeners

searchBox1.addEventListener("mouseenter", function() {
	hoverHelp("searchBox1")
})
searchBox1.addEventListener("mouseleave", function () {
	hoverHelp("default")
})
searchBox2.addEventListener("mouseenter", function () {
	hoverHelp("searchBox2")
})
searchBox2.addEventListener("mouseleave", function () {
	hoverHelp("default")
})
startsWithButton.addEventListener("mouseenter", function () {
	hoverHelp("startsWithButton")
})
startsWithButton.addEventListener("mouseleave", function () {
	hoverHelp("default")
})
containsButton.addEventListener("mouseenter", function () {
	hoverHelp("containsButton")
})
containsButton.addEventListener("mouseleave", function () {
	hoverHelp("default")
})
fuzzyButton.addEventListener("mouseenter", function () {
	hoverHelp("fuzzyButton")
})
fuzzyButton.addEventListener("mouseleave", function () {
	hoverHelp("default")
})
endsWithButton.addEventListener("mouseenter", function () {
	hoverHelp("endsWithButton")
})
endsWithButton.addEventListener("mouseleave", function () {
	hoverHelp("default")
})
clearButton.addEventListener("mouseenter", function () {
	hoverHelp("clearButton")
})
clearButton.addEventListener("mouseleave", function () {
	hoverHelp("default")
})


// contextual help

function hoverHelp(event) {
	if (event == "searchBox1") {
		footerText.innerHTML = "What is the defined Pāḷi term you are looking for?"
	}
	else if (event == "searchBox2") {
		footerText.innerHTML = "Use this box to search within results."
	}
	else if (event == "startsWithButton") {
		footerText.innerHTML = "Search for definitions starting with the term."
	}
	else if (event == "containsButton") {
		footerText.innerHTML = "Click here to search anywhere in the definition. Or even easier, just press the ENTER key."
	}
	else if (event == "fuzzyButton") {
		footerText.innerHTML = `Fuzzy search looks for long and short vowels "a" and "ā", every form of a consonant "t", "th", "tth", "ṭ", "ṭh", "ṭṭh", and all nasals "ṅ", "ñ", "ṇ", "n" and "ṃ."`
	}
	else if (event == "endsWithButton") {
		footerText.innerHTML = "Search for definitions ending with the term."
	}
	else if (event == "clearButton") {
		footerText.innerHTML = "Start again with a calm and clear screen."
	}
	else {
		footerText.innerHTML = '<a href="https://digitalpalidictionary.github.io/" target="_blank">Built for DPD'
	}
}

// main functions

function getValues(searchtype) {
	let searchTerm1 = searchBox1.value
	let searchTerm2 = searchBox2.value

	if (searchTerm1 == "" && searchTerm2 == "" ) {
		searchMessage.innerHTML = "Searching for <b>emptiness</b>? Please enter <b>a letter or two</b> at least."
		searchResults.textContent = ""

	} else {
		// standardize niggahitas
		let am = RegExp("ŋ|ṁ", "g")
		searchTerm1 = searchTerm1.replace(am, "ṃ")
		searchTerm2 = searchTerm2.replace(am, "ṃ")
		
		// make search flags	

		if (regexChar.test(searchTerm1)) {
			runSearch(searchTerm1, searchTerm2, "regex")
		}

		else if (searchtype == "startswith") {
			runSearch(searchTerm1, searchTerm2, "startwith")
		}

		else if (searchtype == "contains") {
			runSearch(searchTerm1, searchTerm2, "contains")
		}

		else if (searchtype == "fuzzy") {
			let fuzzy1= fuzzyValues(searchTerm1)
			let fuzzy2 = fuzzyValues(searchTerm2)
			runSearch(fuzzy1, fuzzy2, "fuzzy")
		}

		else if (searchtype == "endswith") {
			runSearch(searchTerm1, searchTerm2, "endswith")
		}
	} 
}


function runSearch(searchTerm1, searchTerm2, flag) {
	let counter = 1
	htmlCompiler = ""

	if (flag == "contains" || flag == "startwith" || flag == "fuzzy" || flag == "endswith") {
		searchTerm1 = searchTerm1.toLowerCase()
		searchTerm2 = searchTerm2.toLowerCase()
	} 

	for (let index in db) {
		let test1
		let test2

		if (counter <= 100) {
			let item = db[index]

			// test criteria

			if (flag == "contains") {
				test1 = (item.bold.search(searchTerm1))
				test2 = (item.commentary.search(searchTerm2))
			} 

			else if (flag == "regex") {
				searchTerm1 = new RegExp(searchTerm1)
				searchTerm2 = new RegExp(searchTerm2)
				test1 = (item.bold.search(searchTerm1))
				test2 = (item.commentary.search(searchTerm2))
			} 
			
			else if (flag == "startwith") {
				test1 = (item.bold.search("^" + searchTerm1))
				test2 = (item.commentary.search(searchTerm2))
			}

			else if (flag == "fuzzy") {
				searchTerm1 = new RegExp(searchTerm1)
				searchTerm2 = new RegExp(searchTerm2)
				test1 = (item.bold.search(searchTerm1))
				test2 = (item.commentary.search(searchTerm2))
			}

			else if (flag == "endswith") {
				test1 = (item.bold.search(searchTerm1 + "$"))
				test2 = (item.commentary.search(searchTerm2))
			}

			// pass test, highlight terms and generte html
		
			if (test1 >= 0 && test2 >= 0) {
				let commentaryHtml = item.commentary

				if (flag == "contains" || flag == "startwith" || flag == "endswith") {
					commentaryHtml = commentaryHtml.replace(searchTerm1, `<span class='hi'>${searchTerm1}</span >`)
					commentaryHtml = commentaryHtml.replace(searchTerm2, `<span class='hi'>${searchTerm2}</span >`)
				}

				else if (flag == "fuzzy" || flag == "regex") {
					let match1 = commentaryHtml.match(searchTerm1)
					let match2 = commentaryHtml.match(searchTerm2)

					if (match1[0] != "" || match2[0] != "" ) {
						commentaryHtml = commentaryHtml.replace(match1[0], `<span class='hi'>${match1[0]}</span >`, "gm")
						commentaryHtml = commentaryHtml.replace(match2[0], `<span class='hi'>${match2[0]}</span >`, "gm")
					}
				}

				htmlCompiler += `<tr><th>${counter}. <b>${item.bold}</b><span class='end'>${item.bold_end}</span></th>
				<td>(${item.ref_code}) ${commentaryHtml}
				</br><span class='info''>${item.nikaya} ${item.book} ${item.title} ${item.subhead}</td></tr>`
				counter += 1
			}
		}
	}
	htmlCompiler += "<tr><td> </td><tr><tr><td> </td><tr>"
	searchResults.innerHTML = htmlCompiler
	makeSearchMessage(searchTerm1, searchTerm2, counter)
}


function makeSearchMessage(searchTerm1, searchTerm2, counter) {
	if (counter == 1) {
		searchMessage.innerHTML = "No results found. Try fuzzy search."
	}
	else if (counter < 101) {
		searchMessage.innerHTML = `<b>${counter - 1}</b> results found.`
	}
	else if (counter == 101) {
		searchMessage.innerHTML = "Only displaying the first <b>100</b> results. Use the second search box to search within these results."
	}
}


function fuzzyValues(fuzzyTerm) {

	let a = RegExp("a|ā", "g")
	fuzzyTerm = fuzzyTerm.replace(a, "(a|ā)")

	let i = RegExp("i|ī", "g")
	fuzzyTerm = fuzzyTerm.replace(i, "(i|ī)")

	let u = RegExp("u|ū", "g")
	fuzzyTerm = fuzzyTerm.replace(u, "(u|ū)")

	let k = RegExp("k|kk|kh|kkh", "g")
	fuzzyTerm = fuzzyTerm.replace(k, "(k|kk|kh|kkh)")

	let g = RegExp("g|gg|gh|ggh", "g")
	fuzzyTerm = fuzzyTerm.replace(g, "(g|gg|gh|ggh)")

	let n = RegExp("ṅ|ñ|ṇ|n|ṃ", "g")
	fuzzyTerm = fuzzyTerm.replace(n, "(ṅ|ñ|ṇ|n|ṃ)")

	let c = RegExp("c|cc|ch|cch", "g")
	fuzzyTerm = fuzzyTerm.replace(c, "(c|cc|ch|cch)")

	let j = RegExp("j|j|jh|jjh", "g")
	fuzzyTerm = fuzzyTerm.replace(j, "(j|j|jh|jjh)")

	let t = RegExp("t|th|tth|ṭ|ṭh|ṭṭh", "g")
	fuzzyTerm = fuzzyTerm.replace(t, "(t|th|tth|ṭ|ṭh|ṭṭh)")

	let d = RegExp("d|dh|ddh|ḍ|ḍh|ḍḍh", "g")
	fuzzyTerm = fuzzyTerm.replace(d, "(d|dh|ddh|ḍ|ḍh|ḍḍh)")

	let p = RegExp("p|pp|ph|pph", "g")
	fuzzyTerm = fuzzyTerm.replace(p, "(p|pp|ph|pph)")

	let b = RegExp("b|bb|bh|bbh", "g")
	fuzzyTerm = fuzzyTerm.replace(b, "(b|bb|bh|bbh)")

	let m = RegExp("m|mm", "g")
	fuzzyTerm = fuzzyTerm.replace(m, "(m|mm)")

	let l = RegExp("l|ḷ", "g")
	fuzzyTerm = fuzzyTerm.replace(l, "(l|ḷ)")

	return fuzzyTerm
	}	


function clearValues() {
	searchBox1.value = ""
	searchBox2.value = ""
	searchBox1.style.width = "50px"
	searchBox2.style.width = "50px"
	searchMessage.innerHTML = "Use <b>plain text</b> or <b>regular expressions</b> for searching."
	searchResults.innerHTML = ""
}
