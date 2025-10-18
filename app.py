import streamlit as st
import streamlit.components.v1 as components

st.set_page_config(page_title="🌌 Groktron Matrix Ultimate", layout="wide", height=800)

# Load your 3 files and embed them
with open("index.html", "r", encoding="utf-8") as f:
    html_content = f.read()

components.html(html_content, height=1000, scrolling=True)
