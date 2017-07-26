describe('Github Api', function() {
    it('should check the github user api endpoint for login information', () => Api.get('https://api.github.com/users/thejsninja').then((data) => {
        Assert(data.login === 'thejsninja');
    }));
});