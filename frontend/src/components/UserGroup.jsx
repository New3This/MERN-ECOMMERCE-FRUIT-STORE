const UserGroup = ({user}) => {
    return (
        <div>
            <h3>{user.username}</h3>
            <p>{user.email}</p>
        </div>
    );

}

export default UserGroup;