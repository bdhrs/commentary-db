import re

from aksharamukha import transliterate
from clean_text import text_cleaner


def get_nikaya_headings_div(file_name, div, para, subhead):
	"""get headings for nikaya texts"""


	if file_name == "s0515m.mul.xml":
		title = "1. aṭṭhakavaggo"
		if div["type"] == "book":
			title = div.p.string
		if div.head["rend"] == "chapter":
			subhead = div.head.string

	else:
		try:
			title = div.head.string
		except:
			title = div.p.string
		title = re.sub("^\\(\\d*\\) ", "", title)

		if "subhead" in str(para):
			subhead = para.string
		elif "subsubhead" in str(para):
			subhead = para.string
		elif "chapter" in str(para):
			subhead = para.string

	return title, subhead


def get_headings_no_div(para, file_name, nikaya, book, title, subhead):
	"""get headings for nikaya texts""" 
	if para["rend"] == "nikaya":
		nikaya = para.string
	if para["rend"] == "book":
		book = para.string
	if para["rend"] == "title":
		title = para.string
	if para["rend"] == "chapter":
		title = para.string
	if para["rend"] == "subhead":
		subhead = para.string
	if para["rend"] == "subsubhead":
		subhead = para.string
	if re.findall("\\[\\d*\\]", str(para)):
		subhead = para.string
		subhead = re.sub("^ *", "", str(subhead))
	
	jaa = ["s0513a2.att.xml", "s0513a3.att.xml"]
	if file_name in jaa:
		nikaya = "khuddakanikāye"
	
	if file_name == "s0514a1.att.xml":
		nikaya = "khuddakanikāye"
		book = "jātaka-aṭṭhakathā"
		title = "(chaṭṭho bhāgo)"

	if file_name == "s0515a.att.xml":
		title = "1. aṭṭhakavaggo"
		if para["rend"] == "chapter":
			subhead = para.string

	if file_name == "s0519a.att.xml":
		nikaya = "khuddakanikāye"
		if para["rend"] == "nikaya": # some subheads tagged nikaya
			subhead = para.string
	
	if file_name == "vin10t.nrf.xml":
		book = "vinayavinicchayo uttaravinicchayo"
	
	if file_name == "abh03a.att.xml":
		if para["rend"] == "chapter":
			book = para.string

	if file_name == "abh05t.nrf.xml":
		book = "pañcapakaraṇa-anuṭīkā"
	
	if file_name == "e0810n.nrf.xml":
		if para["rend"] == "subsubhead":
			title = para.string

	aññā = ["e0101n.mul.xml", "e0102n.mul.xml", "e0103n.att.xml", "e0104n.att.xml", "e0809n.nrf.xml", "e0810n.nrf.xml"]
	if file_name in aññā:
		nikaya = "aññā"
	
	vin_t = ["vin04t.nrf.xml", "vin08t.nrf.xml", "vin09t.nrf.xml", "vin10t.nrf.xml", "vin11t.nrf.xml", "vin13t.nrf.xml"]
	if file_name in vin_t:
		nikaya = "vinayapiṭake"

	abh_t = ["abh06t.nrf.xml", "abh07t.nrf.xml", "abh08t.nrf.xml", "abh09t.nrf.xml"]
	if file_name in abh_t:
		nikaya = "abhidhammapiṭake"
		if para["rend"] == "nikaya":
			book = para.string

	return nikaya, book, title, subhead


def get_bold_strings(bold, useless):
	"""get bold strings previous next and cleanup"""
	
	bold_p = ""

	prev_sibs = bold.previous_siblings
	for prev_sib in prev_sibs:
			try:
				bold_p = f"{prev_sib}{bold_p}"
			except:
				pass
	
	# bold_p = re.sub("(\\d\\.|\\d*\\.|\\d.*\\d\\.)", "", bold_p)
	bold_p = re.sub("^.*(\\.|;) ", "", bold_p)
	bold_p = re.sub(f"^{useless}", "", bold_p)
	
	bold_n = ""

	next_sibs = bold.next_siblings
	for next_sib in next_sibs:
		try:
			bold_n = f"{bold_n}{next_sib}"
		except:
			pass
	
	bold_n = re.sub("(.*\\.).*$", "\\1", bold_n)
	bold_n = re.sub("(\\. .+?\\. .+?\\. .+?\\.).+", "\\1", bold_n)

	bold_e = bold.next_sibling
	bold_e = re.sub(" .+$", "", str(bold_e))

	bold_comp = f"{bold_p}{bold}{bold_n}"
	bold_comp = re.sub("""\\<hi rend\\="bold">""", "<b>", bold_comp)
	bold_comp = re.sub("""<\\/hi>""", "</b>", bold_comp)
	


	bold = re.sub("""<hi rend\\="bold">""", "", str(bold))
	bold = re.sub("""<\\/hi>""", "", str(bold))

	# remove unneccessary punctuation
	bold = text_cleaner(bold)
	bold_e = text_cleaner(bold_e)
	bold_comp = text_cleaner(bold_comp)

	return bold, bold_e, bold_comp, bold_n


def transliterate_xml(xml):
	"""transliterate from devanagari to roman"""
	xml = transliterate.process("autodetect", "IASTPali", xml)
	xml = xml.replace("ü", "u")
	xml = xml.replace("ï", "i")
	return xml
