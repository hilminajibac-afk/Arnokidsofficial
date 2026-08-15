/* =====================================================
   ARNOKIDS USER PAGES
===================================================== */
(async()=>{
  const {data,error}=await supabaseClient.auth.getSession();
  if(error||!data.session){location.href='login.html';return;}
  const user=data.session.user;
  window.ARNOKIDS_USER=user;

  const toast=(msg)=>{const el=document.getElementById('toast');if(!el)return;el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2200)};
  window.showUserToast=toast;

  // common profile data
  let profile=null;
  const r=await supabaseClient.from('profiles').select('*').eq('id',user.id).single();
  if(!r.error) profile=r.data;
  window.ARNOKIDS_PROFILE=profile||{};

  const name=profile?.nama||user.user_metadata?.nama||'Nama Pengguna';
  document.querySelectorAll('[data-profile-name]').forEach(e=>e.textContent=name);
  document.querySelectorAll('[data-profile-wa]').forEach(e=>e.textContent=profile?.whatsapp||'-');
  document.querySelectorAll('[data-profile-email]').forEach(e=>e.textContent=profile?.email||user.email||'-');

  // Edit profile
  const form=document.getElementById('editProfileForm');
  if(form){
    form.nama.value=profile?.nama||'';
    form.whatsapp.value=profile?.whatsapp||'';
    form.email.value=profile?.email||user.email||'';
    const avatar=document.getElementById('avatarPreview');
    const saved=localStorage.getItem('arnokids_avatar_'+user.id); if(saved&&avatar) avatar.innerHTML='<img src="'+saved+'">';
    document.getElementById('photoInput')?.addEventListener('change',e=>{
      const file=e.target.files?.[0]; if(!file)return; const rd=new FileReader(); rd.onload=()=>{localStorage.setItem('arnokids_avatar_'+user.id,rd.result);avatar.innerHTML='<img src="'+rd.result+'">'}; rd.readAsDataURL(file);
    });
    form.addEventListener('submit',async e=>{
      e.preventDefault();
      const nama=form.nama.value.trim(); let wa=form.whatsapp.value.replace(/\D/g,''); if(wa.startsWith('62'))wa='0'+wa.slice(2); if(wa.startsWith('8'))wa='0'+wa;
      const email=form.email.value.trim().toLowerCase();
      const {error}=await supabaseClient.from('profiles').update({nama,whatsapp:wa,email}).eq('id',user.id);
      if(error){toast('Gagal memperbarui profil');console.error(error);return;}
      // Keep Auth email in sync when possible. This may trigger Supabase confirmation depending on project settings.
      if(email && email!==user.email){const up=await supabaseClient.auth.updateUser({email});if(up.error)console.warn(up.error);}
      toast('Profil berhasil diperbarui');
      setTimeout(()=>location.href='profile.html',800);
    });
  }

  // Addresses: project currently has no address table in the supplied code, so keep this feature functional per user locally.
  const addrKey='arnokids_addresses_'+user.id;
  const getAddresses=()=>JSON.parse(localStorage.getItem(addrKey)||'[]');
  const saveAddresses=a=>localStorage.setItem(addrKey,JSON.stringify(a));
  const renderAddresses=()=>{
    const box=document.getElementById('addressList'); if(!box)return; const arr=getAddresses(); box.innerHTML='';
    if(!arr.length){box.innerHTML='<div class="empty"><i class="fa-solid fa-location-dot"></i><p>Belum ada alamat tersimpan.</p></div>';return;}
    arr.forEach((a,i)=>{const card=document.createElement('div');card.className='card address-card '+(a.main?'main':'');card.innerHTML=`<div class="address-title">${a.main?'Alamat Utama':'Alamat Lain'}${a.main?'<span class="badge">Utama</span>':''}</div><div class="address-name">${escapeHtml(a.name)}</div><div class="address-text">${escapeHtml(a.wa)}<br>${escapeHtml(a.city)} • ${escapeHtml(a.address)}<br>${escapeHtml(a.district)} • ${escapeHtml(a.postal)}</div><div class="address-actions"><button class="secondary" data-edit="${i}">Edit</button>${!a.main?'<button class="secondary" data-main="'+i+'">Jadikan Utama</button>':'<button class="secondary" data-delete="'+i+'">Hapus</button>'}</div>`;box.appendChild(card);});
    box.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>openAddressForm(+b.dataset.edit));
    box.querySelectorAll('[data-main]').forEach(b=>b.onclick=()=>{const a=getAddresses();a.forEach(x=>x.main=false);a[+b.dataset.main].main=true;saveAddresses(a);renderAddresses();toast('Alamat utama diperbarui')});
    box.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>{const a=getAddresses();a.splice(+b.dataset.delete,1);saveAddresses(a);renderAddresses();toast('Alamat dihapus')});
  };
  function escapeHtml(s=''){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
  function openAddressForm(index=-1){const modal=document.getElementById('addressModal'); if(!modal)return; const a=index>=0?getAddresses()[index]:{}; modal.classList.add('show'); modal.querySelector('[name=index]').value=index; modal.querySelector('[name=name]').value=a.name||'';modal.querySelector('[name=wa]').value=a.wa||'';modal.querySelector('[name=address]').value=a.address||'';modal.querySelector('[name=city]').value=a.city||'Surabaya';modal.querySelector('[name=district]').value=a.district||'';modal.querySelector('[name=postal]').value=a.postal||'';modal.querySelector('[name=main]').checked=!!a.main;}
  window.openAddressForm=openAddressForm;
  const af=document.getElementById('addressForm');
  if(af){document.getElementById('addAddressBtn')?.addEventListener('click',()=>openAddressForm());document.getElementById('closeAddress')?.addEventListener('click',()=>document.getElementById('addressModal').classList.remove('show'));af.addEventListener('submit',e=>{e.preventDefault();const a=getAddresses();const item={name:af.querySelector('[name="name"]').value.trim(),wa:af.querySelector('[name="wa"]').value.trim(),address:af.querySelector('[name="address"]').value.trim(),city:af.querySelector('[name="city"]').value.trim(),district:af.querySelector('[name="district"]').value.trim(),postal:af.querySelector('[name="postal"]').value.trim(),main:af.querySelector('[name="main"]').checked};const idx=+af.index.value;if(item.main)a.forEach(x=>x.main=false);if(idx>=0)a[idx]=item;else a.push(item);if(!a.some(x=>x.main)&&a.length)a[0].main=true;saveAddresses(a);document.getElementById('addressModal').classList.remove('show');renderAddresses();toast('Alamat berhasil disimpan')});renderAddresses();}

  // Settings: UI settings are stored per account locally because supplied project has no settings table.
  const settingKey='arnokids_settings_'+user.id; const settings=Object.assign({notif:true,appearance:'light'},JSON.parse(localStorage.getItem(settingKey)||'{}'));
  const notif=document.getElementById('notifToggle'); if(notif){notif.checked=!!settings.notif;notif.onchange=()=>{settings.notif=notif.checked;localStorage.setItem(settingKey,JSON.stringify(settings));toast('Pengaturan notifikasi disimpan')}}
  const theme=document.getElementById('themeSelect'); if(theme){theme.value=settings.appearance;theme.onchange=()=>{settings.appearance=theme.value;localStorage.setItem(settingKey,JSON.stringify(settings));document.documentElement.dataset.theme=theme.value;toast('Tampilan diperbarui')}}

  // Logout modal
  const modal=document.getElementById('logoutModal'); const logout=async()=>{await supabaseClient.auth.signOut();localStorage.removeItem('activeCartUser');location.href='index.html'};
  document.querySelectorAll('[data-logout]').forEach(b=>b.onclick=()=>modal?.classList.add('show'));document.getElementById('cancelLogout')?.addEventListener('click',()=>modal?.classList.remove('show'));document.getElementById('confirmLogout')?.addEventListener('click',logout);

  // Order history: only query if an orders table exists. No fake order data is inserted.
  const orderBox=document.getElementById('orderList'); if(orderBox){
    let result=await supabaseClient.from('orders').select('*').eq('user_id',user.id).order('created_at',{ascending:false});
    if(result.error){console.warn('orders table belum tersedia:',result.error.message);orderBox.innerHTML='<div class="empty"><i class="fa-solid fa-box-open"></i><h3>Riwayat pesanan belum tersedia</h3><p>Fitur ini akan aktif setelah backend pesanan ARNOKIDS tersedia.</p></div>';}else{renderOrders(result.data||[])}
    function renderOrders(orders){if(!orders.length){orderBox.innerHTML='<div class="empty"><i class="fa-solid fa-box-open"></i><h3>Belum ada pesanan</h3><p>Pesanan yang dibuat akan muncul di sini.</p></div>';return} orderBox.innerHTML=orders.map(o=>`<div class="card order-card"><div class="order-top"><span class="order-id">${escapeHtml(o.order_number||o.id||'Pesanan')}</span><span class="status ${(o.status||'').toLowerCase()}">${escapeHtml(o.status||'Diproses')}</span></div><div class="order-meta">${o.total_items??'-'} produk • Rp ${Number(o.total||o.total_price||0).toLocaleString('id-ID')}</div></div>`).join('')}
    document.querySelectorAll('[data-order-tab]').forEach(t=>t.onclick=async()=>{document.querySelectorAll('[data-order-tab]').forEach(x=>x.classList.remove('active'));t.classList.add('active');const val=t.dataset.orderTab;if(!result.data)return;let arr=result.data;if(val==='proses')arr=arr.filter(o=>!['selesai','completed'].includes(String(o.status||'').toLowerCase()));if(val==='selesai')arr=arr.filter(o=>['selesai','completed'].includes(String(o.status||'').toLowerCase()));renderOrders(arr)})
  }
})();
