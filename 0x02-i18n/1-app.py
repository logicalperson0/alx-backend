#!/usr/bin/env python3
"""
a basic Flask app
"""
from flask import Flask, render_template
from flask_babel import Babel


class Config:
    """configure available languages in our app"""
    BABEL_DEFAULT_LOCALE = 'en'
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_TIMEZONE = 'UTC'


app = Flask(__name__)
app.config.from_object(Config)
babel = Babel(app)


@app.route("/")
def index():
    """renders an index.html template"""
    return render_template('1-index.html')


if __name__ == '__main__':
    app.run()
