export default class RoleService {
  checkRouteAccess(props: { location: { pathname: string; search?: string } },
    fromPage: string = ''
  ): boolean  {
    const access_details: string[] = JSON.parse(localStorage.getItem('access_details') || '[]');
    
    const pathStr = props.location.pathname.split('/');
    
    const pathIdx = pathStr.length > 3 ? 2 : pathStr.length - 1;
    let PAGE_NAME = fromPage || pathStr[pathIdx].slice(0, -1);

    /** Quick Fix */
    if (pathStr[1] === 'masters' && (pathStr[2]?.indexOf('address-config') > -1 || pathStr[2]?.indexOf('denominations') >= -1)) {
      return true;
    }

    if (pathStr[1] === 'provider' && (pathStr[2]?.indexOf('visit-fee') > -1)) {
      return true;
    }

    /** Quick Fix */

    if (pathStr[1] === 'user-management' && pathStr[2] === 'access-rights') {
      PAGE_NAME = 'ROLE';
    } else if (pathStr[1] === 'masters' && pathStr[2] === 'benefit-hierarchy') {
      PAGE_NAME = 'BENEFITSSTRCTURE';
    } else if (pathStr[pathIdx].split('-').length > 1) {
      PAGE_NAME = pathStr[pathIdx].split('-')[0];
    }
    
    const accessList = access_details.filter(ad => ad?.indexOf(PAGE_NAME.toUpperCase()) > -1);
    
    
    if (props.location.search?.includes('edit')) {
      return accessList.some((role) => role?.includes('UPDATE'));
    } else if (props.location.search?.includes('create')) {
      return accessList.some((role) => role?.includes('CREATE'));
    } else {
      return accessList.some((role) => role?.includes('VIEW'));
    }
  }

  checkActionPermission(
    PAGE_NAME: string,
    accessName: string,
    fnc: () => void = () => {},
    actionButtons: { key: string }[] = []
  ): any {
    const access_details: string[] = JSON.parse(localStorage.getItem('access_details') || '[]');

    if (actionButtons.length > 0) {
      const actionList: any[] = [];

      for (let idx = 0; idx < actionButtons.length; idx++) {
        const action = actionButtons[idx];
        const ROLE_NAME = action.key.toUpperCase();
        const [PERMISSION, MODULE_NAME] = ROLE_NAME.split('_');

        const accessList = access_details
          .filter((ad) => ad?.includes(MODULE_NAME))
          .map((ac) => ac.split('_')[0]);

        const status = accessList.some((a) => a?.includes(PERMISSION));

        if (!status) {
          break;
        } else {
          actionList.push(action);
        }
      }

      
return actionList;
    }else {
      const accessList = access_details.filter(ad => ad?.indexOf(PAGE_NAME) > -1).map(ac => ac.split('_')[0]);
      const status = accessList.some(a => a?.indexOf(accessName) > -1);

      if (accessName === 'UPDATE') {
        if (status) {
          return [
            {
              icon: 'pi pi-user-edit',
              className: 'ui-button-warning',
              onClick: fnc,
            },
          ];
        } else {
          return [];
        }
      } else {
        return status;
      }
    }
  }
}
