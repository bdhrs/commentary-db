import re

with open("index.html") as f:
	html = f.read()

with open("index.css") as f:
	css = f.read()

with open("index.js") as f:
	js = f.read()
	js = re.sub(r"import { db } from './commdef.js'", "", js)
	js = js.replace(
		"""import { TextProcessor, Script, paliScriptInfo, getScriptForCode } from './pali-script.mjs'""", 
	""
	)

with open("commdef.json") as f:
	db = f.read()
	db = f"""const db = {db}"""

with open("pali-script.mjs") as f:
	translit = f.read()
	translit = re.sub("export.+", "", translit)

# add css
html = re.sub(
	r"""<link rel="stylesheet" type="" href="index.css">\n""",
	f"""<style>{css}</style>""", 
	html)

# add translit and db

html = html.replace(
	"""<script type="module" src="pali-script.mjs"></script>""",
	f"""<script>
	{translit}
	</script>
	<script>
	{db}
	</script>""")

# add js
html = re.sub(
	r"""<script type="module" src="index.js"></script>""",
	f"""<script>{js}</script>""",
	html)

with open ("Pāḷi Definitions Search.html", "w") as f:
	f.write(html)



