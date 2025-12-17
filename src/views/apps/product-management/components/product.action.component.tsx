
import { useRouter, useSearchParams } from 'next/navigation';

import ProductManagementForm from './product.management.form';

export default function ProductsActionComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const mode = searchParams.get('mode');
    const id = searchParams.get('id');

    if (!mode || mode !== 'edit') {
        // Redirect to the edit mode if the query parameter is not set or is invalid
        if (id) {
            router.replace(`/products/${id}?mode=edit`);
        }

        
return null; // Render nothing while redirecting
    }

    return (
        <div>
            {mode === 'edit' && <ProductManagementForm />}
        </div>
    );
}
