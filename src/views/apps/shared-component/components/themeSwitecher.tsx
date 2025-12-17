import React, { useEffect, useState } from 'react';


const themes = [
    { name: 'bootstrap4-light-blue', label: 'Bootstrap 4 Light Blue' },
    { name: 'bootstrap4-light-purple', label: 'Bootstrap 4 Light Purple' },
    { name: 'bootstrap4-dark-blue', label: 'Bootstrap 4 Dark Blue' },
    { name: 'bootstrap4-dark-purple', label: 'Bootstrap 4 Dark Purple' },
    { name: 'md-light-indigo', label: 'MD Light Indigo' },
    { name: 'md-light-deeppurple', label: 'MD Light Deep Purple' },
    { name: 'md-dark-indigo', label: 'MD Dark Indigo' },
    { name: 'md-dark-deeppurple', label: 'MD Dark Deep Purple' },
    { name: 'mdc-light-indigo', label: 'MDC Light Indigo' },
    { name: 'mdc-light-deeppurple', label: 'MDC Light Deep Purple' },
    { name: 'mdc-dark-indigo', label: 'MDC Dark Indigo' },
    { name: 'mdc-dark-deeppurple', label: 'MDC Dark Deep Purple' },
    { name: 'tailwind-light', label: 'Tailwind Light' },
    { name: 'fluent-light', label: 'Fluent Light' },
    { name: 'vela-blue', label: 'Vela Blue' },
    { name: 'vela-green', label: 'Vela Green' },
    { name: 'vela-orange', label: 'Vela Orange' },
    { name: 'vela-purple', label: 'Vela Purple' },
    { name: 'arya-blue', label: 'Arya Blue' },
    { name: 'arya-green', label: 'Arya Green' },
    { name: 'arya-orange', label: 'Arya Orange' },
    { name: 'arya-purple', label: 'Arya Purple' },
];


const ThemeSwitcher = () => {
    const [selectedTheme, setSelectedTheme] = useState('bootstrap4-light-blue');

    useEffect(()=>{
        localStorage.setItem('selectedTheme', 'bootstrap4-light-blue');
        addPrimeReact();
    },[])

    useEffect(() => {
        const storedTheme = localStorage.getItem('selectedTheme');

        if (storedTheme && themes.some((theme) => theme.name === storedTheme)) {
            handleThemeChange(storedTheme);
        }
    }, []);

    const [anchorEl, setAnchorEl] = useState(null);

    // const handleClick = (event) => {
    //     setAnchorEl(event.currentTarget);
    // };

    const handleClose = () => {
        setAnchorEl(null);
    };

   
    const handleThemeChange = (themeName: any) => {

        localStorage.setItem('selectedTheme', themeName);
        const linkElement = document.createElement('link');

        linkElement.setAttribute('rel', 'stylesheet');
        linkElement.setAttribute('type', 'text/css');
        linkElement.setAttribute('href', `/themes/${themeName}/theme.css`);

        const existingLinkElement = document.getElementById('theme-link');

        if (existingLinkElement) {
            document.head.removeChild(existingLinkElement);
        }

        linkElement.id = 'theme-link';
        document.head.appendChild(linkElement);


        setSelectedTheme(themeName);
    };

    const addPrimeReact = ()=>{
        const primeReactLink = document.createElement('link');

        primeReactLink.setAttribute('rel', 'stylesheet');
        primeReactLink.setAttribute('href', 'https://cdn.jsdelivr.net/npm/primereact@8.2.0/resources/primereact.min.css');
    
        const primeIconsLink = document.createElement('link');

        primeIconsLink.setAttribute('rel', 'stylesheet');
        primeIconsLink.setAttribute('href', 'https://cdn.jsdelivr.net/npm/primeicons@4.1.0/primeicons.css');
    
        document.head.appendChild(primeReactLink);
        document.head.appendChild(primeIconsLink);
    }

    return (
        <div>
            {/* <Button
                aria-controls="theme-menu"
                aria-haspopup="true"
                onClick={handleClick}
                className="w-full md:w-14rem"
            >
                {selectedTheme || 'Select a Theme'}
            </Button> */}
            {/* <Menu
                id="theme-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {themes.map((theme) => (
                    <MenuItem
                        key={theme.name}
                        onClick={() => handleThemeChange(theme.name)}
                    >
                        {theme.label}
                    </MenuItem>
                ))}
            </Menu> */}
        </div>
    );
};

export default ThemeSwitcher;
