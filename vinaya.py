#!/usr/bin/env python3.10


from bs4 import BeautifulSoup
import pandas as pd
import re
from functions import transliterate_xml
from timeis import timeis, yellow, line, tic, toc
from clean_text import text_cleaner

# print(f"{timeis()} {line}")
# print(f"{timeis()} {yellow}building database of vinaya")
# print(f"{timeis()} {line}")

cst_dir = "../Cst4/Xml/"
output_dir = "output/"
# log_file = "log/log.tsv"
# log = open(log_file, "a")

file_list = [
    "vin01m.mul.xml",
    "vin02m1.mul.xml",
    "vin02m2.mul.xml",
    "vin02m3.mul.xml",
    "vin02m4.mul.xml"
]


search_word = input("what are you looking for? ")
search_sentence = re.compile(
	f"(\\. |\\! |\\? |^)(.[^.]*?{search_word}.*?($|\\. |\\! |\\? ))")


txt = open("output/vinaya_results.txt", "w")

for file_name in file_list:
	print(f"{timeis()} {file_name}")

	result_counter = 1

	# transliterate the xml files into roman and save
	with open(f"{cst_dir}{file_name}", "r", encoding="UTF-16") as f:
		xml = f.read()

	xml = transliterate_xml(xml)

	with open(f"../Cst4/xml roman/{file_name}", "w") as w:
		w.write(xml)

	# make the soup
	soup = BeautifulSoup(xml, "xml")

	# remove all the "pb" tags
	pbs = soup.find_all("pb")
	for pb in pbs:
		pb.decompose()

	# remove all the notes
	notes = soup.find_all("note")
	for note in notes:
		note.decompose()

	# remove all the para tags
	pns = soup.find_all("p")
	for pn in pns:
		del pn["n"]

	# remove all the hi tags
	his = soup.find_all("hi")
	for hi in his:
		hi.unwrap()
	
	with open(f"output/temp/{file_name}.xml", "w") as w:
		w.write(soup.prettify())

	nikaya = soup.find_all("p", rend="nikaya")[0].string
	book = soup.find_all("head", rend="book")[0].string

	# book number
	if book == "pārājikapāḷi":
		book_no = "1."
	elif book == "pācittiyapāḷi":
		book_no = "2."
	elif book == "mahāvaggapāḷi":
		book_no = "3."
	elif book == "cūḷavaggapāḷi":
		book_no = "4."
	elif book == "parivārapāḷi":
		book_no = "5."

	# div: div type = "kanda"
	# nikaya: p rend = "nikaya"
	# book: head rend ="book"
	# kanda: div.head rend = "chapter"
	# sutta: p rend = "title"
	# subtitle: p rend = "subhead"



	divs = soup.find_all("div", type="kanda")

	for div in divs:

		sutta_counter = 1
		sutta_counter = 1
		subtitle_count = 1
		
		kanda = ""
		sutta_name = ""
		sutta_no = ""
		subtitle = ""
		subtitle_no = ""

		# get kanda name and number
		if div.head["rend"] == "chapter":
			kanda = div.head.string
			sutta_counter = 1
			if kanda == "verañjakaṇḍaṃ":
				kanda_no = "0."
			else:
				kanda_no = re.sub("^ ", "", kanda)
				kanda_no = re.sub("(^\\d*\\.)(.+)", "\\1", kanda_no)

		paras = div.children

		for para in paras:

			# get sutta name and number
			if "title" in str(para):
				if not re.findall("vaggo$", para.string):
					sutta_name = para.string
					subtitle_count = 1
					subtitle = ""
					subtitle_no = ""

					sutta_no = f"{sutta_counter}."
					sutta_no = re.sub("(^\\d*\\.)(.+)", "\\1", sutta_name)
					sutta_clean = re.sub("(^\\d*\\. )(.+)", "\\2", sutta_name)
					sutta_counter +=1

			if "subhead" in str(para):
				subtitle = para.string
				subtitle_no = f"{subtitle_count}."
				subtitle_count += 1

			text = para.get_text()
			results = re.findall(search_sentence, text)

			# clean up results and print
			txt = open("output/vinaya_results.txt", "a")
			for result in results:
				clean_result = text_cleaner(result[1])

				txt.write(f"[{result_counter}]\n\n")
				txt.write(f"VIN {book_no}{kanda_no}")
				if sutta_no != "":
					txt.write(f"{sutta_no}")
				if subtitle_no != "":
					txt.write(f"{subtitle_no}")
				if sutta_name == "":
					txt.write(f"\t{kanda}")
				else:
					txt.write(f"\t{sutta_clean}")
					if subtitle != "":
							txt.write(f", {subtitle}")
				txt.write(f"\t{clean_result}")
				txt.write(f"\n[{nikaya} {book} {kanda}")
				if sutta_name == "" and subtitle == "":
					txt.write(f"]")
				elif sutta_name != "" and subtitle == "":
					txt.write(f" {sutta_name}]")
				elif sutta_name != "" and subtitle != "":
					txt.write(f" {sutta_name} {subtitle}]")
				elif sutta_name == "" and subtitle != "":
					txt.write(f" {subtitle}]")
				txt.write(f"\n\n")

				result_counter += 1

txt.close()
