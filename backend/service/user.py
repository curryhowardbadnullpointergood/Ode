def get_user_by_user_id(user_id, container):
    user_doc_ref = container.document(user_id)
    user_doc = user_doc_ref.get()

    if not user_doc.exists:
        return None

    user_data = user_doc.to_dict()
    return user_data
