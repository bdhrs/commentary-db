import re

def text_cleaner(text):
	text = re.sub(" – ‘‘", ", ", text)
	text = re.sub("^‘‘", "", text)
	text = re.sub("  ", " ", text)
	text = re.sub("^\\d*\\. ", "", text)
	text = re.sub("’’", "'", text)
	text = re.sub("‘", "", text)
	text = re.sub("’", "'", text)
	text = re.sub("‘‘", "'", text)
	text = re.sub("‘‘", "", text)
	text = re.sub(" ’", "", text)
	text = re.sub("'", "'", text)
	text = re.sub("'nti", "n'ti", text)
	text = re.sub("…pe॰…", " …", text)
	text = re.sub(" $", "", text)
	text = re.sub("^ ", "", text)
	text = re.sub(" – ", ", ", text)
	text = re.sub(" \\.", ".", text)
	text = re.sub(" ,", ",", text)
	text = re.sub(";", ",", text)
	text = re.sub("'\\.", ".", text)
	return text