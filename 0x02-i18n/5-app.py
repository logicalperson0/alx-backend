#!/usr/bin/env python3
"""
a basic Flask app
"""
from flask import Flask, render_template, request
from flask_babel import Babel


class Config:
    """configure available languages in our app"""
    BABEL_DEFAULT_LOCALE = 'en'
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_TIMEZONE = 'UTC'


app = Flask(__name__)
app.config.from_object(Config)
babel = Babel(app)


@babel.localeselector
def get_locale():
    """determine the best match with our supported languages"""
    locale = request.args.get('locale')
    if locale in Config.LANGUAGES:
        return locale
    return request.accept_languages.best_match(LANGUAGES)

users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}

def get_user(user_id):
    """returns a user dictionary or None if the ID cannot be
    found or if login_as was not passed."""
    if user_id:
        return users.get(int(user_id))
    return None

@app.before_request
def before_request():
    """use get_user to find a user if any, and set
    it as a global on flask.g.user."""
    g.user = get_user(request.args.get('login_as'))

@app.route("/")
def index():
    """renders an index.html template"""
    return render_template('4-index.html')


if __name__ == '__main__':
    app.run()