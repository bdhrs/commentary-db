let c = console.log

import { db } from './commdef.js'

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

/////////// listeners

// script selector

const scriptSelectorButton = document.getElementById("select-script-button")
let selectedScript = "Roman"
scriptSelectorButton.addEventListener("click", function () {
	if (selectedScript == "Roman") {
		selectedScript = "Sinhala"
		scriptSelectorButton.innerHTML = "සි"
		searchMessage.innerHTML = "දැන් <b>සිංහලෙන්</b> හොයනවා"
	} else {
		selectedScript = "Roman"
		scriptSelectorButton.innerHTML = "R"
		searchMessage.innerHTML = "now searching in <b>Roman</b>"
	}
})

// text to unicode

searchBox1.addEventListener("keyup", function () {
	let textInput = searchBox1.value
	textInput = uniCoder(textInput)
	searchBox1.value = textInput
})
searchBox2.addEventListener("keyup", function () {
	let textInput = searchBox2.value
	textInput = uniCoder(textInput)
	searchBox2.value = textInput
})

function uniCoder(textInput) {
	if (!textInput || textInput == '') return textInput
	
	textInput = textInput.replace(/aa/g, 'ā').replace(/ii/g, 'ī').replace(/uu/g, 'ū').replace(/\.t/g, 'ṭ').replace(/\.d/g, 'ḍ').replace(/\"n/g, 'ṅ').replace(/\'n/g, 'ṅ').replace(/\.n/g, 'ṇ').replace(/\.m/g, 'ṃ').replace(/\~n/g, 'ñ').replace(/\.l/g, 'ḷ').replace(/\.h/g, 'ḥ').toLowerCase()
	c(textInput)
	return textInput
}

// trigger the search

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
	getValues("contains")
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

// setup transliterator
import { TextProcessor, Script, paliScriptInfo, getScriptForCode } from './pali-script.mjs'

function toRo(text) {
	text = TextProcessor.basicConvert(text, Script.RO)
	return text
}

function fromRo(text) {
	text = TextProcessor.basicConvertFrom(text, Script.RO)
	return text
}

function getValues(searchtype) {
	let searchTerm1 = searchBox1.value
	let searchTerm2 = searchBox2.value

	if (selectedScript != "Roman") {
		searchTerm1 = toRo(searchTerm1)
		searchTerm2 = toRo(searchTerm2)
	}

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
				let searchTerm1Translit = fromRo(searchTerm1)
				let searchTerm2Translit = fromRo(searchTerm2)

				if (selectedScript != "Roman") {
					commentaryHtml = nti(commentaryHtml)
					commentaryHtml = fromRo(commentaryHtml)
					let regex = new RegExp("<බ්>", "gm") 
					commentaryHtml = commentaryHtml.replace(regex, "<b>")
					regex = new RegExp("</බ්>", "gm") 
					commentaryHtml = commentaryHtml.replace(regex, "</b>")
				}
				
				if (flag == "contains" || flag == "startwith" || flag == "endswith") {
					if (selectedScript != "Roman") {
						commentaryHtml = commentaryHtml.replace(searchTerm1Translit, `<span class='hi'>${searchTerm1Translit}</span >`)
						commentaryHtml = commentaryHtml.replace(searchTerm2Translit, `<span class='hi'>${searchTerm2Translit}</span >`)
					} else {
						commentaryHtml = commentaryHtml.replace(searchTerm1, `<span class='hi'>${searchTerm1}</span >`)
						commentaryHtml = commentaryHtml.replace(searchTerm2, `<span class='hi'>${searchTerm2}</span >`)
					}
				}

				else if (flag == "fuzzy" || flag == "regex") {
					let match1
					let match2

					if (selectedScript != "Roman") {
						// cant highlight fuzzy in sinahla
					} else {
						match1 = commentaryHtml.match(searchTerm1)
						match2 = commentaryHtml.match(searchTerm2)
						if (match1[0] != "" || match2[0] != "") {
							commentaryHtml = commentaryHtml.replace(match1[0], `<span class='hi'>${match1[0]}</span >`, "gm")
							commentaryHtml = commentaryHtml.replace(match2[0], `<span class='hi'>${match2[0]}</span >`, "gm")
						}
					}
				}
				if (selectedScript != "Roman") {
					let headword = nti(item.bold + item.bold_end)
					c(headword)
					htmlCompiler += `<tr><th>${counter}. <b>${fromRo(headword)}</b></th>
					<td>(${fromRo(item.book)}) ${commentaryHtml}
					</br><span class='info''>${fromRo(item.nikaya)} ${fromRo(item.book)} ${fromRo(item.title)} ${fromRo(item.subhead)}</td></tr>`
				} else {
					htmlCompiler += `<tr><th>${counter}. <b>${item.bold}</b><span class='end'>${item.bold_end}</span></th>
					<td>(${item.ref_code}) ${commentaryHtml}
					</br><span class='info''>${item.nikaya} ${item.book} ${item.title} ${item.subhead}</td></tr>`
				}
				counter += 1
			}
		}
	}
	htmlCompiler += "<tr><td> </td><tr><tr><td> </td><tr>"
	searchResults.innerHTML = htmlCompiler
	makeSearchMessage(counter)
}


function makeSearchMessage(counter) {
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

	let a = RegExp("aa|aā|āa|a|ā", "g")
	fuzzyTerm = fuzzyTerm.replace(a, "(a|ā|aa|aā|āa)")

	let i = RegExp("ii|iī|īi|i|ī", "g")
	fuzzyTerm = fuzzyTerm.replace(i, "(i|ī|ii|iī|īi)")

	let u = RegExp("uu|uū|ūu|u|ū", "g")
	fuzzyTerm = fuzzyTerm.replace(u, "(u|ū|uu|uū|ūu)")

	let k = RegExp("kkh|kk|kh|k", "g")
	fuzzyTerm = fuzzyTerm.replace(k, "(k|kk|kh|kkh)")

	let g = RegExp("ggh|gg|gh|g", "g")
	fuzzyTerm = fuzzyTerm.replace(g, "(g|gh|gg|ggh)")

	let n = RegExp("ṅṅ|ññ|ṇṇ|nn|ṅ|ñ|ṇ|n|ṃ", "g")
	fuzzyTerm = fuzzyTerm.replace(n, "(ṅ|ñ|ṇ|n|ṅṅ|ññ|ṇṇ|nn|ṃ)")

	let c = RegExp("cch|cc|ch|c", "g")
	fuzzyTerm = fuzzyTerm.replace(c, "(c|ch|cc|cch)")

	let j = RegExp("jjh|jj|jh|j", "g")
	fuzzyTerm = fuzzyTerm.replace(j, "(j|jh|jj|jjh)")

	let t = RegExp("ṭṭh|tth|ṭṭ|tt|ṭh|th|ṭ|t", "g")
	fuzzyTerm = fuzzyTerm.replace(t, "(ṭ|ṭh|ṭṭ|ṭṭh|t|tt|th|tth)")

	let d = RegExp("ḍḍh|ddh|ḍḍ|dd|ḍh|dh|ḍ|d", "g")
	fuzzyTerm = fuzzyTerm.replace(d, "(ḍ|ḍh|ḍḍ|ḍḍh|d|dh|dd|ddh)")

	let p = RegExp("pph|pp|ph|p", "g")
	fuzzyTerm = fuzzyTerm.replace(p, "(p|ph|pp|pph)")

	let b = RegExp("bbh|bb|bh|b", "g")
	fuzzyTerm = fuzzyTerm.replace(b, "(b|bh|bb|bbh)")

	let m = RegExp("mm|m|ṃ", "g")
	fuzzyTerm = fuzzyTerm.replace(m, "(m|mm|ṃ)")

	let y = RegExp("yy|y", "g")
	fuzzyTerm = fuzzyTerm.replace(y, "(y|yy)")

	let r = RegExp("rr|r", "g")
	fuzzyTerm = fuzzyTerm.replace(r, "(r|rr)")

	let l = RegExp("ll|l|ḷ", "g")
	fuzzyTerm = fuzzyTerm.replace(l, "(l|ll|ḷ)")

	let v = RegExp("vv|v", "g")
	fuzzyTerm = fuzzyTerm.replace(v, "(v|vv)")

	let s = RegExp("ss|s", "g")
	fuzzyTerm = fuzzyTerm.replace(s, "(s|ss)")

	console.log(fuzzyTerm)
	return fuzzyTerm
	}	

function nti (text) {
	// converts roman gamanan'ti to asian gamana'nti 
	let nti = RegExp("n'ti", "g")
	text = text.replace(nti, "'nti")
	return text
}


function clearValues() {
	searchBox1.value = ""
	searchBox2.value = ""
	searchBox1.style.width = "50px"
	searchBox2.style.width = "50px"
	searchMessage.innerHTML = "Use <b>Velthuis</b>, <b>Unicode diacritics</b> or <b>regular expressions</b> for searching."
	searchResults.innerHTML = ""
}



