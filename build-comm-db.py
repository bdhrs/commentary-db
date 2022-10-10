#!/usr/bin/env python3.10

from bs4 import BeautifulSoup
import pandas as pd
import re
from functions import get_nikaya_headings_div, get_headings_no_div, transliterate_xml, get_bold_strings
from timeis import timeis, green, white, yellow, line, tic, toc

print(f"{timeis()} {line}")
print(f"{timeis()} {yellow}building database of commentarial defintions")
print(f"{timeis()} {line}")

cst_dir = "../Cst4/Xml/"
output_dir = "output/"
log_file = "log/log.tsv"
log = open (log_file, "a")

file_list = {

	"vin01m.mul.xml":"VIN",
    "vin02m1.mul.xml": "VIN",
    "vin02m2.mul.xml": "VIN",
    "vin02m3.mul.xml": "VIN",
    "vin02m4.mul.xml": "VIN",


	"s0515m.mul.xml": "NIDD1",
	"s0516m.mul.xml": "NIDD2",
	"s0517m.mul.xml": "PM",
	"s0519m.mul.xml": "NP",
	"s0520m.nrf.xml": "PTP",

    "abh01m.mul.xml": "DHS",

	"vin01a.att.xml": "VINa",
	"vin02a1.att.xml": "VINa",
	"vin02a2.att.xml": "VINa",
	"vin02a3.att.xml": "VINa",
	"vin02a4.att.xml": "VINa",

	"s0101a.att.xml": "DNa",
	"s0102a.att.xml": "DNa",
	"s0103a.att.xml": "DNa",

	"s0201a.att.xml": "MNa",
	"s0202a.att.xml": "MNa",
	"s0203a.att.xml": "MNa",

	"s0301a.att.xml" : "SNa",
	"s0302a.att.xml": "SNa",
	"s0303a.att.xml": "SNa",
	"s0304a.att.xml": "SNa",
	"s0305a.att.xml": "SNa",

	"s0401a.att.xml": "ANa",
	"s0402a.att.xml": "ANa",
	"s0403a.att.xml": "ANa",
	"s0404a.att.xml": "ANa",

	"s0501a.att.xml": "KPa",
	"s0502a.att.xml": "DHPa",
	"s0503a.att.xml": "UDa",
	"s0504a.att.xml": "ITIa",
	"s0505a.att.xml": "SNPa",
	"s0506a.att.xml": "VVa",
	"s0507a.att.xml": "PVa",
	"s0508a1.att.xml": "THa",
	"s0508a2.att.xml": "THa",
	"s0509a.att.xml": "THIa",
	"s0510a.att.xml": "APAa",
	"s0511a.att.xml": "BVa",
	"s0512a.att.xml": "CPa",
	"s0513a1.att.xml": "JAa",
	"s0513a2.att.xml": "JAa",
	"s0513a3.att.xml": "JAa",
	"s0513a4.att.xml": "JAa",
	"s0514a1.att.xml": "JAa",
	"s0514a2.att.xml": "JAa",
	"s0514a3.att.xml": "JAa",
	"s0515a.att.xml": "NIDD1a",
	"s0516a.att.xml": "NIDD2a",
	"s0517a.att.xml": "PMa",
	"s0519a.att.xml": "NPa",
	"s0501t.nrf.xml" : "NPt",

   	"abh01a.att.xml" : "ADHa",
    "abh02a.att.xml" : "ADHa",
    "abh03a.att.xml" : "ADHa",
	
	# visuddhimagga
    "e0101n.mul.xml": "VISM",
    "e0102n.mul.xml": "VISM",

	# vinaya sub-commentaries
	"vin01t1.tik.xml": "VINt",
    "vin01t2.tik.xml": "VINt",
    "vin02t.tik.xml": "VINt",
    "vin04t.nrf.xml": "KVa",
    "vin05t.nrf.xml": "VSa",
    "vin06t.nrf.xml": "VBt",
    "vin07t.nrf.xml": "VMVt",
    "vin08t.nrf.xml": "VAt",
    "vin09t.nrf.xml": "KVt",
    "vin10t.nrf.xml": "VVUt",
    "vin11t.nrf.xml": "VVt",
    "vin12t.nrf.xml": "PYt",
    "vin13t.nrf.xml": "VINt",

	# sutta sub-commentaries
    "s0101t.tik.xml": "DNt",
    "s0102t.tik.xml": "DNt",
    "s0103t.tik.xml": "DNt",
	"s0104t.nrf.xml": "DNt",
	"s0105t.nrf.xml": "DNt",

    "s0201t.tik.xml": "MNt",
    "s0202t.tik.xml": "MNt",
    "s0203t.tik.xml": "MNt",

    "s0301t.tik.xml": "SNt",
    "s0302t.tik.xml": "SNt",
    "s0303t.tik.xml": "SNt",
    "s0304t.tik.xml": "SNt",
    "s0305t.tik.xml": "SNt",

    "s0401t.tik.xml": "ANt",
    "s0402t.tik.xml": "ANt",
    "s0403t.tik.xml": "ANt",
    "s0404t.tik.xml": "ANt",

    "s0519t.tik.xml": "NPt",

	# abhidhamma sub-commentary
	"abh01t.tik.xml": "DHSt",
    "abh02t.tik.xml": "VIBHt",
    "abh03t.tik.xml": "ADHt",
	"abh04t.nrf.xml": "DHSt",
    "abh05t.nrf.xml": "ADHt",
    "abh06t.nrf.xml": "ADHt",
    "abh07t.nrf.xml": "ADHt",
    "abh08t.nrf.xml": "ADHt",
    "abh09t.nrf.xml": "ADHt",

	# visuddhimagga commentary
   	"e0103n.att.xml": "VISMa",
	"e0104n.att.xml": "VISMa",

    # abhidhānappadīpikā
	"e0809n.nrf.xml": "APP",
	"e0810n.nrf.xml": "APt",

}

useless = [" ", "  ", "   ", ".", ". ", ". ", " .", " . ", ",", " ,", " , "]
useless_endings = ["ti.", "'ti.", "nti.", "'nti.", "."]

def make_db():
	"""extract commentary definitions from xml"""
	f1 = open("output/comm-def.csv", "w")
	f1.write(f"file_name\tref_code\tnikaya\tbook\ttitle\tsubhead\tbold\tbold_end\tcommentary\n")
	
	bold_total = 0

	for file_name, ref_code in file_list.items():
		print(f"{timeis()} {file_name}\t{ref_code}", end="\t")
		log.write(f"{timeis()}\t{file_name}\t{ref_code}\t")

		bold_count1 = 0
		bold_count2 = 0
		no_meaning_count = 0
		nikaya, book, title, subhead = ["", "", "", ""]
		
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

		# remove all the hi parunum dot tags
		his = soup.find_all("hi", rend=["paranum", "dot"])
		for hi in his:
			hi.unwrap()

		# if the element and the next element is bold, join them

		# grab the number of bolds
		bold_count1 = len(soup.find_all("hi", rend="bold"))
		
		# grab the headings for suttas pitaka
		if soup.div is not None:
			print(f"has div", end="\t")
			log.write(f"has div\t")

			nikaya = soup.find_all("p", rend="nikaya")[0].string
			book = soup.find_all("head", rend="book")[0].string

			divs = soup.find_all("div", type=["sutta", "vagga", "chapter", "samyutta", "kanda", "khandaka"])

			# no real divs in anguttara ṭīkā
			ant = ["s0401t.tik.xml", "s0402t.tik.xml", "s0403t.tik.xml", "s0404t.tik.xml"]
			if file_name in ant:
				divs = soup.find_all("div", type=["book"])

			for div in divs:
				paras = div.find_all("p")

				for para in paras:
					title, subhead = get_nikaya_headings_div(
						file_name, div, para, subhead)
					bolds = para.find_all("hi", rend=["bold"])

					for bold in bolds:
						if bold.next_sibling is not None:
							bold, bold_e, bold_comp, bold_n = get_bold_strings(
								bold, useless)
							
							# only write substantial examples
							bold_comp_clean = re.sub("\\<b\\>|\\</b\\>", "", bold_comp)
							if f"{bold}{bold_e}" == bold_comp_clean:
								no_meaning_count +=1
							elif bold_n in useless_endings:
								no_meaning_count += 1
								continue
							else:
								f1.write(f"{file_name}\t{ref_code}\t{nikaya}\t{book}\t{title}\t{subhead}\t{bold}\t{bold_e}\t{bold_comp}\n")
								bold_count2 += 1

			print(f"{bold_count1}\t{bold_count2}\t{no_meaning_count}")
			log.write(f"{bold_count1}\t{bold_count2}\t{no_meaning_count}\n")

			bold_total += bold_count2
								
		# for vinaya, khuddaka nikaya, vism
		elif soup.div is None:
			print(f"no div", end="\t")
			log.write(f"no div\t")

			paras = soup.find_all("p")

			for para in paras:
				nikaya, book, title, subhead = get_headings_no_div(para, file_name, nikaya, book, title, subhead)
				bolds = para.find_all("hi", rend="bold")

				for bold in bolds:
					if bold.next_sibling is not None:
						bold, bold_e, bold_comp, bold_n  = get_bold_strings(
							bold, useless)

						# only write substantial examples
						bold_comp_clean = re.sub("\\<b\\>|\\</b\\>", "", bold_comp)
						if f"{bold}{bold_e}" == bold_comp:
							no_meaning_count += 1
						elif bold_n in useless_endings:
							no_meaning_count += 1
							continue
						else:
							f1.write(f"{file_name}\t{ref_code}\t{nikaya}\t{book}\t{title}\t{subhead}\t{bold}\t{bold_e}\t{bold_comp}\n")
							bold_count2 += 1
	
			print(f"{bold_count1}\t{bold_count2}\t{no_meaning_count}")
			log.write(f"{bold_count1}\t{bold_count2}\t{no_meaning_count}\n")
			bold_total+= bold_count2
	
	print(f"{timeis()} bold_total {bold_total}")
	f1.close()
	log.close()

def convert_csv_to_json():
	"""convert to json for use externally"""
	
	print(f"{timeis()} {green}converting csv to json", end=" ")
	df = pd.read_csv("output/comm-def.csv", sep="\t")
	df.fillna("", inplace=True)
	df.to_json("html/commdef.json", force_ascii=False,
			orient="records", indent=5)

	print(f"{timeis()} {white}ok")

if __name__ == "__main__":
	tic()
	make_db()
	convert_csv_to_json()
	toc()
