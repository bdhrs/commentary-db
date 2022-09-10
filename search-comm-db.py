#!/usr/bin/env python3.10
import pandas as pd
from timeis import green, white, red
import re

def search_db_from_terminal():
	"""search the commentary definitions db"""

	search1 = ""
	search2 = ""

	comm_db = pd.read_csv("output/comm-def.csv", sep="\t")
	comm_db.fillna("", inplace=True)

	while 1==1:

		search1 = input(f"{green}search for the definition of: {white}")
		search1_text = search1
		if search1 == "":
			search1 = ".+"
			search1_text = "anything"
		if search1 == "exit":
			break

		search2 = input(f"{green}which contains: {white}")
		search2_text = search2
		if search2 == "":
			search2 = ".+"
		if search2 == "exit":
			break
		if search1 == ".+" and search2 == ".+":
			print(f"{red}please enter a valid search string\n")
			continue
		print()
		
		test1 = comm_db["bold"].str.contains(search1)
		test2 = comm_db["commentary"].str.contains(search2)
		filter = test1 & test2
		search_db = comm_db[filter]
		search_db.reset_index(inplace=True)

		with open("dpdb.css") as f:
			css = f.read()
		
		with open("output/search_results.html", "w") as f:
			f.write(f"<html>{css}<body><table>")

			heading = f'searching for commentary definitions of <b><span class="hi">{search1_text}</span></b>'
			if search2_text != "":
				heading += f' which contain <span class="hi">{search2_text}</span>'
			
			f.write(f"<tr><th colspan='4'><p class='he'>{heading}</p></tr></th>")
			
			counter = 1
			for row in range(len(search_db)):
				ref_code = search_db.loc[row, "ref_code"]
				nikaya = search_db.loc[row, "nikaya"]
				book = search_db.loc[row, "book"]
				section = search_db.loc[row, "title"]
				sutta = search_db.loc[row, "subhead"]
				bold = search_db.loc[row, "bold"]
				if search1 != ".+":
					bold = re.sub(search1, f"<span class = 'hi'>{search1}</span>", bold)
				bold_e = search_db.loc[row, "bold_end"]
				comm = search_db.loc[row, "commentary"]
				if search2 != ".+":
					comm = re.sub(search2, f"<span class = 'hi'>{search2}</span>", comm)


				line = f"<tr><td>{counter}.</td><th><b>{bold}</b><span class='end'>{bold_e}</span></th><td>({ref_code}) {comm}<br><span class='info''>{nikaya} {book} {section} {sutta}</td></tr>"

				f.write(line)
				counter += 1
	
		
if __name__ == "__main__":
	search_db_from_terminal()

