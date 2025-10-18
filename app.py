import streamlit as st
import streamlit.components.v1 as components

st.set_page_config(page_title="🌌 Groktron Matrix Ultimate", layout="wide")

st.markdown("""
    <style>
    [data-testid="stSidebar"] {display: none !important}
    #MainMenu {visibility: hidden !important}
    footer {visibility: hidden !important}
    .stApp {background-color: transparent !important}
    </style>
""", unsafe_allow_html=True)

with open("index.html", "r", encoding="utf-8") as f:
    html_content = f.read()

components.html(
    f"""
    <div style="width:100vw;height:100vh;overflow:hidden;margin:0;padding:0;">
        {html_content}
    </div>
    """,
    height=1080,
    scrolling=False
)
