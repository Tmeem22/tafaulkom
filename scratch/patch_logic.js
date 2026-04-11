const fs = require('fs');
const path = require('path');

const targetPath = path.join(process.cwd(), 'src/app/dashboard/page.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Update handleOrderSubmit logic
const oldSubmit = /const handleOrderSubmit = async \(e: React\.FormEvent\) => \{[\s\S]*?finally \{[\s\S]*?setSubmitting\(false\);[\s\S]*?\}[\s\S]*?\};/;
const nextSubmit = `const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!isSubscription && !link) {
      setMessage({ type: 'error', text: 'الرجاء إدخال الرابط' });
      return;
    }
    if (isSubscription && !subUsername) {
      setMessage({ type: 'error', text: 'الرجاء إدخال يوزر الحساب للاشتراك' });
      return;
    }
    
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        serviceId: selectedServiceId,
        isSubscription
      };
      
      if (isSubscription) {
        payload.username = subUsername;
        payload.minQty = subMin;
        payload.maxQty = subMax;
        payload.posts = subPosts;
        payload.delay = subDelay;
      } else {
        payload.link = link;
        payload.quantity = quantity;
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'حدث خطأ أثناء الطلب');
      }

      setMessage({ type: 'success', text: isSubscription ? 'تم تفعيل الاشتراك التلقائي بنجاح!' : 'تم استلام طلبك بنجاح!' });
      setBalance(data.newBalance);
      if (!isSubscription) setLink('');
      else setSubUsername('');
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };`;

content = content.replace(oldSubmit, nextSubmit);
fs.writeFileSync(targetPath, content);
console.log('Logic Update successful');
