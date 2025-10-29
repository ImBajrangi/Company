import telebot
from telebot import types
import os

# --- 1. Configuration ---
# IMPORTANT: This token has been replaced with the one you provided for @VrindaFoodiesbot.
# Keep this token secure!
BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN', '8291351652:AAFyMxmuQw2MNuSmre8gZibnO_21YbKfftI')

# Initialize the bot object
# skip_pending=False ensures the bot processes messages received while it was offline
bot = telebot.TeleBot(BOT_TOKEN, skip_pending=False)

# --- 2. Command Handlers ---

@bot.message_handler(commands=['start', 'help'])
def send_welcome(message):
    """Handles the /start and /help commands."""
    try:
        chat_id = message.chat.id
        # Safely get the user's first name
        user_name = message.from_user.first_name if message.from_user.first_name else "There"

        response_text = (
            f"Hello, {user_name}! I'm your new Telegram Echo Bot.\n"
            f"I can echo back anything you say to me.\n\n"
            f"Try typing any message, or use the command /hello."
        )

        # Create a simple inline keyboard button
        markup = types.InlineKeyboardMarkup()
        btn_hello = types.InlineKeyboardButton('Greet Me Again', callback_data='say_hello')
        markup.add(btn_hello)

        bot.send_message(chat_id, response_text, reply_markup=markup)

    except Exception as e:
        print(f"Error handling /start or /help: {e}")
        bot.send_message(message.chat.id, "Sorry, I ran into an error while starting up.")

@bot.message_handler(commands=['hello'])
def send_hello(message):
    """Handles the /hello command."""
    try:
        bot.reply_to(message, "General Kenobi! You are a bold one.")
    except Exception as e:
        print(f"Error handling /hello: {e}")

# --- 3. Callback Query Handler (for inline buttons) ---

@bot.callback_query_handler(func=lambda call: True)
def callback_query(call):
    """Handles callback data from inline keyboards."""
    try:
        if call.data == "say_hello":
            # Show a small notification to the user that the button was clicked
            bot.answer_callback_query(call.id, "Greeting acknowledged!")
            bot.send_message(call.message.chat.id, "Pleased to meet you again! What can I echo now?")
    except Exception as e:
        print(f"Error handling callback query: {e}")
        bot.answer_callback_query(call.id, "An error occurred during button processing.")

# --- 4. Message Handler (The Echo Function) ---

@bot.message_handler(func=lambda message: True)
def echo_all(message):
    """Handles all other plain text messages by echoing them back."""
    try:
        # bot.reply_to sends a reply to the original message
        bot.reply_to(message, f"You said: {message.text}")
    except Exception as e:
        print(f"Error handling echo: {e}")

# --- 5. Main Execution Block ---

def main():
    """Main function to start the bot."""
    print("Starting Telegram Bot...")

    if BOT_TOKEN == 'YOUR_BOT_TOKEN_HERE':
        print("\n*** ERROR: TOKEN NOT SET ***")
        print("Please replace 'YOUR_BOT_TOKEN_HERE' with your actual bot token from BotFather.")
        return # Exit if token is default placeholder

    # Start the bot. This is a blocking call that listens for messages forever.
    try:
        print("Bot is listening for messages. Press Ctrl+C to stop.")
        # `infinity_polling` handles continuous listening and automatic reconnection
        bot.infinity_polling()
    except KeyboardInterrupt:
        print("\nBot stopped by user.")
    except Exception as e:
        print(f"Bot polling stopped due to an error: {e}")
        print("Please ensure your bot token is correct and your internet connection is stable.")

if __name__ == '__main__':
    # Instructions before running:
    # 1. Install the library: pip install pyTelegramBotAPI
    # 2. Replace 'YOUR_BOT_TOKEN_HERE' with your actual token. (DONE)
    # 3. Run the script: python telegram_bot.py
    main()
