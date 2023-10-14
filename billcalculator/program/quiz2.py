
def is_email(email):
    if not " " in email and email.endswith('.uk') and email.count('@') == 1:
        return 'yes'
    else:
        return 'no'


is_email('trang13.uk')












